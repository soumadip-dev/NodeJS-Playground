What is BLOOm Filter?

When designing platforms like *Twitter* or *Gmail*, checking if a username is available in a database with millions of users can be extremely slow. Performing a database scan for every sign-up attempt creates a heavy load on the system.

We can do one thing to speed up the process:
* **Hash Map:** store them dkjsfh in shbd hskd sd,it fasdfnl Provides $O(1)$ lookup time, which is fast, but it is not space-efficient as the number of users grows into the millions it take a lot of jaksbfk  kin the bmo cost .
the solution for this is tj ldf bnlognsd filer
* **Bloom Filter:** Offers a balance between space efficiency and lookup speed by using a **probabilistic** approach.

Bloom filters maidn sd on ** false positives** a dit mak dsfdg  rely on two primary components:
1. **Hash Functions:** Map inputs (like usernames) to specific indices in a bi dfds array.
2. **Bit Array (Buckets):** A series of bits (initialized to 0) where indices are set to 1 when an item is added.

**Key Characteristics:**
* **No False Negatives:** If the filter says a username is not taken, it is guaranteed to be available .
* **False Positives:** The filter may sometimes report a username as taken even if it is not, because multiple items might map to the same set of bits (collisions).

Bloom filters are used in large-scale systems where occasional false positives are acceptable, such as:
* **Username availability checks**  jkdsfh j sdlf  is used ptod gl seracsf in th jksa ld
* **Spam filters**  agkfrl ak asdfh kld  asdgas d used
* **URL security checks** e.g., *Chrome* checking for malicious sites

By increasing the number of buckets and using better hash functions, you can significantly reduce the probability of collisions and false positives.

---
---
---
# Bloom Filter

## 1. What Is a Bloom Filter?

When designing large-scale platforms like **Twitter** or **Gmail**, we may need to check whether a username already exists among millions of users.

Performing a database lookup for every username availability request can create a significant load on the database.

A **Bloom Filter** can be used as a fast, space-efficient way to determine whether an item **might exist** in a dataset before querying the database.

---

## 2. Why Do We Need a Bloom Filter?

Suppose we want to check whether a username is already registered.

### Hash Map

We could store all usernames in a **Hash Map**.

* Provides average **O(1)** lookup time.
* However, storing millions of usernames requires significant **memory**.
* For very large datasets, the memory cost can become substantial.

### Bloom Filter

A **Bloom Filter** provides a more **space-efficient** approach.

It uses a **probabilistic data structure** to quickly determine whether an item is possibly present in a dataset.

The basic idea is:

```text
Username
   ↓
Bloom Filter
   ↓
Is it possibly present?
   ↓
Yes → Check Database
No  → Definitely not present
```

This allows the system to avoid unnecessary database queries.

---

## 3. How Does a Bloom Filter Work?

A Bloom Filter primarily consists of two components:

### 3.1 Bit Array

A **bit array** is a sequence of bits initially set to `0`.

For example:

```text
0 0 0 0 0 0 0 0 0 0
```

When an item is added, certain positions in the bit array are changed from `0` to `1`.

Example:

```text
0 1 0 0 1 0 0 1 0 0
```

### 3.2 Hash Functions

One or more **hash functions** are used to map an input, such as a username, to positions in the bit array.

For example:

```text
Username
   ↓
Hash Function 1 → Index 2
Hash Function 2 → Index 5
Hash Function 3 → Index 8
```

The corresponding bits are then set to `1`.

---

## 4. Adding an Item

Suppose we want to add:

```text
username = "soumadip"
```

The Bloom Filter passes the username through multiple hash functions:

```text
"soumadip"
    ↓
┌───────────────┐
│ Hash Function │
└───────────────┘
    ↓
Indexes: 2, 5, 8
```

The bits at those positions are set to `1`:

```text
Index:  0 1 2 3 4 5 6 7 8 9
Bits:   0 0 1 0 0 1 0 0 1 0
```

The Bloom Filter does **not store the actual username**. It only stores information about which bits were set.

---

## 5. Checking an Item

When checking whether a username exists, the same hash functions are applied.

Suppose we check:

```text
"soumadip"
```

The hash functions again produce:

```text
Indexes: 2, 5, 8
```

The Bloom Filter checks those positions.

### Case 1: Any Bit Is `0`

If at least one required bit is `0`:

```text
Index:  0 1 2 3 4 5 6 7 8 9
Bits:   0 0 1 0 0 0 0 0 1 0
              ↑     ↑
```

The item is **definitely not present**.

> **A Bloom Filter never produces a false negative.**

### Case 2: All Bits Are `1`

If all required bits are `1`:

```text
Index:  0 1 2 3 4 5 6 7 8 9
Bits:   0 0 1 0 0 1 0 0 1 0
```

The item **might be present**.

It could also be a **false positive** because another item may have already set the same bits.

Therefore:

> **Bloom Filter says "not present" → definitely not present.**
> **Bloom Filter says "present" → possibly present; verify with the database.**

---

## 6. False Positives

A **false positive** occurs when the Bloom Filter reports that an item may exist even though it was never added.

This happens because multiple items can map to the same bit positions.

For example:

```text
User A → bits 2, 5, 8
User B → bits 1, 5, 8
```

Later, another username may hash to:

```text
bits 5, 8, 2
```

Since all those bits are already `1`, the Bloom Filter may report that the username exists.

However, it may not actually exist in the database.

The application can therefore verify the result with the database:

```text
Bloom Filter
     ↓
Possibly exists
     ↓
Database lookup
     ↓
Confirm actual existence
```

---

## 7. Key Characteristics

### No False Negatives

If the Bloom Filter says an item is **not present**, it is guaranteed that the item was not added to the filter.

```text
Bloom Filter → NOT PRESENT
              ↓
        Definitely absent
```

### False Positives Are Possible

If the Bloom Filter says an item **may be present**, the item might actually be absent.

```text
Bloom Filter → POSSIBLY PRESENT
              ↓
        Check Database
```

This trade-off allows Bloom Filters to achieve very high **space efficiency**.

---

## 8. Bloom Filter in a Real System

Consider a username availability system:

```text
User enters username
        ↓
   Bloom Filter
        ↓
   ┌────┴────┐
   ↓         ↓
Absent     Present
   ↓         ↓
Available   Check DB
            ↓
       Confirm result
```

If the Bloom Filter says the username is definitely absent, the system can avoid a database query.

If it says the username may exist, the system performs a database lookup for confirmation.

This reduces unnecessary database operations.

---

## 9. Common Use Cases

Bloom Filters are useful in large-scale systems where **space efficiency and fast membership checks** are important and occasional false positives are acceptable.

Common examples include:

* **Username availability checks**
* **Spam filtering**
* **URL security and malicious-site checks**
* **Duplicate detection**
* **Database and storage systems**
* **Caching systems**

---

## 10. Reducing False Positives

The probability of false positives depends on factors such as:

* **Size of the bit array**
* **Number of hash functions**
* **Number of items inserted**

Using an appropriately sized bit array and a suitable number of hash functions can significantly reduce the false-positive probability.

However:

> **Bloom Filters trade some accuracy for significant memory savings and fast membership checks.**

---

