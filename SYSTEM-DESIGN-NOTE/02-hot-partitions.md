# Hot Partition in Databases

## 1. What Is a Hot Partition, and Why Doesn't Consistent Hashing Prevent It?

A **hot partition** occurs when a single database partition receives a disproportionately high amount of traffic compared to other partitions.

This usually happens when a specific piece of data, such as a viral social media post, suddenly becomes extremely popular.

### Key Point: Data Distribution vs. Traffic Distribution

**Consistent hashing** may distribute data keys evenly across partitions:

```text
DB0 → 25%
DB1 → 25%
DB2 → 25%
DB3 → 25%
```

However, it does **not guarantee that traffic will be evenly distributed**.

If `post500` becomes viral and maps to `DB2`, millions of requests may target the same partition:

```text
DB0 → 10K req/s
DB1 → 12K req/s
DB2 → 1M req/s  ← Hot Partition
DB3 → 11K req/s
```

> **Balanced data distribution ≠ balanced traffic distribution**

The hot partition can become overloaded, causing **high latency, slowdowns, or crashes**, even though the overall data distribution is balanced.

---

## 2. Read Hotspots vs. Write Hotspots

### Read Hotspots

**Read hotspots** occur when a large number of requests repeatedly read the same data.

They are relatively easier to handle using:

- **Caching**
- **Read replicas**

For example:

```text
              post500
                 ↓
        ┌────────┼────────┐
     Primary   Replica   Replica
```

Read requests can be distributed across replicas, reducing the load on the primary.

### Write Hotspots

**Write hotspots** occur when a large number of requests update the same key or record.

For example, a popular post's like counter:

```text
post500.likeCount++
```

Millions of users updating the same value create a bottleneck on one database key.

**Read replicas do not solve this problem**, because writes generally have to be processed by the **primary**.

```text
1M likes
   ↓
Primary DB
```

Therefore:

> **Read hotspots can often be handled by distributing reads, while write hotspots require distributing or aggregating the writes themselves.**

---

# Core Mitigation Strategies for Hot Partitions

## 3. Sharded Counters: Split One Counter into Multiple Counters

Instead of maintaining one counter:

```text
post500:likes
```

we create multiple logical counters, called **shards** or **buckets**:

```text
post500:counter0
post500:counter1
post500:counter2
post500:counter3
...
post500:counterN
```

Different users can write to different counters:

```text
User A → counter2
User B → counter0
User C → counter3
User D → counter1
```

Instead of:

```text
Everyone
   ↓
post500:likes
   ↓
ONE hot location
```

the traffic becomes:

```text
                ┌→ counter0
Users → routing ├→ counter1
                ├→ counter2
                └→ counter3
```

This distributes write traffic across multiple keys.

### 3.1 Choosing the Bucket

A common approach is:

```text
hash(postId + userId) % N
```

For example, with 10 buckets:

```text
hash(post500 + user123) % 10
```

If the result is `3`, the write goes to:

```text
post500:counter3
```

Another user may produce `7`:

```text
post500:counter7
```

This spreads writes across the available buckets.

### 3.2 Trade-Off of Sharded Counters

Previously, retrieving the total was simple:

```text
GET post500:likes
```

With sharded counters, the total must be calculated from all buckets:

```text
total =
counter0 +
counter1 +
counter2 +
...
+ counterN
```

Therefore:

> **Sharded counters distribute writes more effectively, but reads become slightly more expensive because multiple counters must be combined.**

---

## 4. Logical Buckets vs. Physical Database Nodes

After creating logical buckets, we need to determine where those buckets are physically stored.

We should **not** make the application directly depend on physical database nodes:

```text
counter0 → DB1
counter1 → DB2
counter2 → DB3
counter3 → DB4
```

The database cluster may change over time.

For example:

```text
Today:
DB1  DB2  DB3  DB4

Later:
DB1  DB2  DB3  DB4  DB5
```

If the application directly manages physical placement, adding or removing database nodes becomes difficult.

### 4.1 Two Levels of Mapping

Separate the **logical bucket** from the **physical database node**:

```text
Application
     ↓
Logical Bucket
     ↓
Consistent Hashing
     ↓
Physical Database Node
```

For example:

```text
post500:counter3
       ↓
Consistent Hashing
       ↓
DB2
```

The application only needs to know about:

```text
post500:counter3
```

It does not need to know that the bucket currently resides on `DB2`.

This creates an important separation:

> **Logical sharding belongs to the application/data model, while physical placement belongs to the database cluster.**

Therefore, database nodes can be **added, removed, or moved** without requiring the application-level bucket structure to change.

---

## 5. Write Buffering and Aggregation

Sharded counters distribute writes, but extremely high traffic can still generate a large number of database operations.

For example:

```text
100,000 likes/second
```

Writing every increment directly to the database may still create unnecessary pressure.

Instead, we can **buffer and aggregate writes before sending them to the main database**.

The basic flow is:

```text
Users
  ↓
Many write requests
  ↓
Fast temporary buffer
  ↓
Combine writes
  ↓
Main Database
```

Instead of processing:

```text
+1
+1
+1
+1
+1
...
```

individually, we can combine them:

```text
1000 individual likes
        ↓
    Aggregate
        ↓
     +1000
        ↓
    Database
```

This reduces the number of database operations.

---

## 6. Redis Aggregation

**Redis** can be used as a fast temporary aggregation layer.

Instead of immediately updating the main database:

```text
Database → +1
Database → +1
Database → +1
Database → +1
```

we temporarily accumulate the increments in Redis:

```text
Redis
post500:likes → INCR
post500:likes → INCR
post500:likes → INCR
...
```

The accumulated value can then periodically be written to the main database:

```text
Redis
  ↓
Aggregate accumulated value
  ↓
Batch update
  ↓
Main Database
```

For example:

```text
10,000 individual increments
          ↓
    Redis aggregation
          ↓
      One batch update
          ↓
       Database
```

The main database therefore processes **fewer write operations**.

---

## 7. Message Queues: Buffer the Traffic

Another approach is using a **message queue**, such as Apache Kafka.

Instead of sending requests directly to the database:

```text
User → Database
```

the system can use:

```text
User
 ↓
Kafka
 ↓
Consumers
 ↓
Database
```

During a sudden traffic spike, the queue temporarily holds incoming events:

```text
100,000 requests/sec
        ↓
      Kafka
        ↓
Consumers process gradually
        ↓
    Database
```

The database does not have to process every request at exactly the same moment.

This is called **asynchronous processing**.

> **The queue absorbs traffic spikes, while consumers process the work at a manageable rate.**

---

## 8. Append-Only Logs: Store Events Instead of Updating One Counter

Another strategy is to avoid repeatedly modifying one shared counter.

Instead of:

```text
post500:likes = 1,000,000
```

record individual events:

```text
User A liked post500
User B liked post500
User C liked post500
User D liked post500
```

These events can be stored sequentially in an **append-only log**:

```text
Event 1 → Like post500
Event 2 → Like post500
Event 3 → Like post500
Event 4 → Like post500
```

The events can later be processed to calculate the aggregate.

The key idea is:

> **Instead of repeatedly mutating one shared value, record events as a stream of additions.**

This reduces contention around a single aggregate record and is useful in **event-driven architectures**.

---

## 9. Dynamic Hot-Key Splitting

Manually creating many buckets for every key is inefficient because most keys may never become hot.

For example:

```text
post101 → 5 requests/sec
post102 → 8 requests/sec
post103 → 10 requests/sec
post500 → 100,000 requests/sec
```

Only `post500` is actually hot.

Therefore, the system should be able to **detect hot keys automatically**.

### 9.1 Detecting Hot Keys

A key can be considered hot based on its **runtime workload**, such as:

- **Requests per second**
- **CPU usage**
- **Queue depth**
- **Write throughput**
- Other relevant system load metrics

The important point is:

> **Hotness is determined by the workload generated by a key, not simply by the size or popularity of its data.**

### 9.2 Automatically Splitting the Hot Key

Initially:

```text
post500:likes
```

The system monitors the workload:

```text
Traffic increases
      ↓
Detect high write rate
      ↓
Mark key as HOT
      ↓
Split into buckets
      ↓
counter0
counter1
counter2
...
counterN
```

Future writes are then distributed across these buckets.

The system dynamically changes from:

```text
Single Counter
```

to:

```text
Sharded Counter
```

only when necessary.

---
