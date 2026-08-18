# Unit 4: File Management — Study Notes (Part 1)

## Q64. What is a File from the Operating System's perspective? Discuss file attributes, file types, and common file extensions.

### 1. The Operating System's Perspective on a File
From the perspective of an operating system, a **file** is a logical abstraction of secondary storage. Secondary storage devices (such as magnetic disks, solid-state drives, and optical discs) are physical, block-oriented devices that read and write data in fixed-size blocks (e.g., 512 bytes or 4 KB). The operating system abstracts these physical details and provides users and applications with a uniform logical storage unit: the file. 

Specifically, a file is a named, contiguous logical address space mapped by the operating system onto non-volatile physical storage. The OS hides the hardware-specific details of block allocation, track/sector geometry, and device drivers, allowing users to interact with data as a continuous stream of bytes or structured records.

```
+-------------------------------------------------------------+
|                       User Application                      |
|              (Sees a continuous stream of bytes)             |
+-------------------------------------------------------------+
                              | (Read/Write Operations)
                              v
+-------------------------------------------------------------+
|                      Operating System                       |
|        (Maps Logical Addresses to Physical Block Numbers)   |
+-------------------------------------------------------------+
                              | (Block I/O Operations)
                              v
+-------------------------------------------------------------+
|                       Physical Device                       |
|           (Reads/Writes Sector/Track/Block Data)            |
+-------------------------------------------------------------+
```

---

### 2. File Attributes
An operating system maintains metadata associated with every file, known as **file attributes**. These attributes vary between operating systems but typically include:

*   **Name:** The human-readable string used to identify the file. It is the only attribute kept in human-readable form.
*   **Identifier:** A unique tag (usually a number) that identifies the file within the file system. In Unix-like systems, this is the inode number.
*   **Type:** Needed for systems that support different file types (e.g., directories, symbolic links, regular files).
*   **Location:** A pointer to a device and to the physical location of the file blocks on that device.
*   **Size:** The current size of the file in bytes, words, or blocks, and possibly the maximum allowed size.
*   **Protection:** Access-control information that determines who can read, write, and execute the file (e.g., read/write/execute permissions).
*   **Time, Date, and User Identification:** Metadata tracking the creation time, last modification time, last access time, and the owner's identity.

All attributes are stored in the directory structure, which resides on secondary storage.

---

### 3. File Types and Common Extensions
To assist the operating system and applications in interpreting the binary contents of a file, files are categorized into types. Some operating systems (like Unix) treat files as raw byte streams and leave type interpretation to applications, while others (like Windows) use file extensions to associate files with specific applications.

| File Type | Common Extensions | Typical Purpose / Description |
| :--- | :--- | :--- |
| **Executable** | `.exe`, `.bin`, `.com` | Machine language programs ready to run. |
| **Object / Library** | `.obj`, `.o`, `.lib`, `.a` | Compiled code, linkable libraries used by developers. |
| **Source Code** | `.c`, `.cpp`, `.java`, `.py` | Raw source code written in programming languages. |
| **Text** | `.txt`, `.md`, `.rtf` | Textual data, documentation, and formatted notes. |
| **System** | `.sys`, `.dll`, `.drv` | Device drivers and dynamic link libraries used by the OS. |
| **Multimedia** | `.mp3`, `.mp4`, `.jpg`, `.png` | Compressed audio, video, and image formats. |
| **Archive** | `.zip`, `.tar`, `.gz`, `.rar` | Multiple files grouped and compressed into a single package. |

---

## Q65. Detail the basic operations that can be performed on a file (Create, Write, Read, Reposition/Seek, Delete, Truncate).

Operating systems provide a set of system calls to manipulate files. To perform any action on a file, the OS must manage both the file's metadata (in directories) and its physical storage blocks. The six basic file operations are detailed below:

```
                    +-----------------------+
                    |  Basic File Operations |
                    +-----------------------+
        ___________/     /      |      \     \___________
       /                /       |       \                \
+------------+  +-----------+ +--------+ +-------------+ +------------+
|   Create   |  | Read/Write| |  Seek  | |   Truncate  | |   Delete   |
| Allocates  |  | Transfers | | Updates| | Resets size | | Reclaims   |
| metadata & |  | data via  | | file   | | to 0; keeps | | blocks and |
| dir entry  |  | pointers  | | pointer| | attributes  | | dir entry  |
+------------+  +-----------+ +--------+ +-------------+ +------------+
```

### 1. Creating a File
To create a file, two steps are necessary:
1.  **Space Allocation:** The OS searches the file system's free-space manager to allocate the initial blocks required for the file's metadata and metadata storage.
2.  **Directory Entry:** A new entry is added to the directory structure. This entry records the file's name, its initial attributes, and its physical location on the disk.

### 2. Writing a File
To write data to a file, the system makes a system call specifying the file's identifier (or descriptor) and the data to be written. 
*   The OS searches the directory (or the open-file table) to find the file's disk location.
*   The system maintains a **write pointer** that tracks where the next write operation should occur. 
*   As data is written, the write pointer is updated:
    $$\text{Pointer}_{\text{new}} = \text{Pointer}_{\text{current}} + \text{Bytes Written}$$
*   If the write exceeds the current allocated block boundary, the OS allocates another block.

### 3. Reading a File
Reading retrieves data from a file to a memory buffer. The system call specifies the file descriptor and the target memory buffer.
*   The OS locates the file and uses a **read pointer** to determine the current offset.
*   Data is read from the disk blocks into memory.
*   The read pointer is advanced:
    $$\text{Pointer}_{\text{new}} = \text{Pointer}_{\text{current}} + \text{Bytes Read}$$
*   Generally, because a process typically reads and writes to the same file, the OS combines these two pointers into a single **current-file-position pointer**.

### 4. Repositioning within a File (Seek)
The reposition operation, commonly called a **seek**, does not perform any disk I/O. Instead, it updates the current-file-position pointer to a specific target value.
$$\text{Pointer}_{\text{current}} = \text{New Offset}$$
This allows applications to navigate directly to any byte offset in the file, enabling random access.

### 5. Deleting a File
To delete a file, the OS reclaims all storage space and directory references:
1.  It searches the directory for the target file name.
2.  Once found, it releases all physical blocks allocated to the file back to the free-space manager.
3.  It erases the file's entry from the directory structure, invalidating its descriptor.

### 6. Truncating a File
Truncating allows a user to clear the contents of a file while keeping its attributes (such as owner, permissions, and name). Instead of deleting the file and recreating it, the system call:
1.  Locates the file's directory/metadata entry.
2.  Frees all of the file's data blocks back to the free-space manager.
3.  Sets the file size attribute to 0.
4.  Resets the current-file-position pointer to 0.

---

## Q66. Discuss File Support mechanisms in OS, including Open-File Tables (system-wide and per-process) and file locking mechanisms.

### 1. Open-File Tables
Searching a directory structure on disk for metadata (permissions, physical blocks) is a computationally expensive operation. To optimize performance, modern operating systems use **Open-File Tables** to cache file metadata in main memory when a file is opened. 

The OS divides this tracking mechanism into a two-level architecture: **Per-Process Open-File Tables** and a **System-Wide Open-File Table**.

```
+------------------+
| User Process A   |
|   fd = 3 --------+-------+
+------------------+       |       +------------------------------------+
                           +------>| Per-Process Open-File Table (A)    |
                                   | - Current offset                   |
                                   | - Access mode (Read/Write)         |
                                   | - Pointer to System-Wide Entry     |
                                   +-----------------+------------------+
                                                     |
                                                     v
+------------------+       +------>+------------------------------------+
| User Process B   |       |       | System-Wide Open-File Table        |
|   fd = 4 --------+-------+       | - In-memory copy of Inode/FCB      |
|                                  | - Open count (Ref count)           |
|                                  | - Disk location details            |
+------------------+               +-----------------+------------------+
                                                     |
                                                     v
                                           +--------------------+
                                           | Disk Inode / FCB   |
                                           +--------------------+
```

#### A. Per-Process Open-File Table
Each process maintains its own table of files it has opened. When a process calls `open()`, the OS returns an index into this table (known as a **file descriptor** in Unix/Linux, or a **file handle** in Windows). Each entry contains:
*   **Current File Pointer:** The offset where the next read/write operation for this specific process will occur.
*   **Access Mode:** The permissions with which the process opened the file (e.g., read-only, write-only, read-write).
*   **System-Wide Table Pointer:** A pointer linking this entry to the corresponding entry in the system-wide table.

#### B. System-Wide Open-File Table
This table contains information that is process-independent and shared system-wide. It contains one entry for each file currently open by *any* process in the system. An entry contains:
*   **File Control Block (FCB) / Inode copy:** The file's metadata cached from the disk (size, permissions, physical block location).
*   **Open Count (Reference Count):** A counter tracking how many processes have this file open. When a process closes the file, the count is decremented. When it reaches 0, the entry is removed, and any modified metadata is written back to the disk.
*   **Lock Status:** Information regarding current locks held on the file.

---

### 2. File Locking Mechanisms
When multiple processes access the same file simultaneously, data corruption can occur. Operating systems implement file locks to synchronize access.

*   **Shared Locks (Reader Locks):** Multiple processes can acquire a shared lock simultaneously. It ensures that while processes are reading the file, no process can write to it.
*   **Exclusive Locks (Writer Locks):** Only one process can hold an exclusive lock at any time. It prevents all other processes from reading or writing to the file, ensuring exclusive access for write operations.

#### Advisory vs. Mandatory Locking
*   **Advisory Locks:** The OS does not enforce the lock. It is up to cooperating processes to check the lock status before performing I/O. If a process ignores the lock and writes directly, the OS will not block it.
*   **Mandatory Locks:** The OS enforces the lock. Once a process acquires an exclusive lock, the OS blocks any read or write system calls from other processes to that file until the lock is released.

---

## Q67. Describe the Sequential Access method. Explain how read/write operations work and when this method is appropriate.

### 1. Conceptual Model of Sequential Access
The **Sequential Access** method is the simplest and oldest access mechanism. In this model, information in a file is processed in order, one record (or byte) after another. This method mimics the physical characteristics of early storage media, such as magnetic tapes, where the read/write head must physically pass through blocks 1, 2, and 3 to reach block 4.

```
       +----------+----------+----------+----------+----------+
File:  | Record 0 | Record 1 | Record 2 | Record 3 | Record 4 |
       +----------+----------+----------+----------+----------+
                               ^
                               |
                      [Current File Pointer]
                      (Can only move forward)
```

In sequential access:
*   The file is viewed as a sequence of logical records.
*   The system maintains a pointer that tracks the current location.
*   Random jumps to arbitrary positions are not permitted; the pointer can only advance or reset to the beginning of the file.

---

### 2. Mechanics of Read and Write Operations
The core operations in sequential access work directly with the implicit file position pointer:

*   **Read Next:** This operation reads the next portion of the file and automatically advances the file pointer by the number of units read.
    $$\text{Read\_Next}() \implies \text{Buffer} = \text{Data}[\text{Pointer}], \quad \text{Pointer} = \text{Pointer} + 1$$
*   **Write Next:** This operation appends or writes data to the end of the file (or at the current pointer) and advances the pointer.
    $$\text{Write\_Next}(\text{Data}) \implies \text{Data}[\text{Pointer}] = \text{Data}, \quad \text{Pointer} = \text{Pointer} + 1$$
*   **Reset / Rewind:** This operation moves the file pointer back to the very beginning of the file.
    $$\text{Reset}() \implies \text{Pointer} = 0$$
*   **Skip Forward / Backward ($N$ Records):** Some sequential systems allow the pointer to skip forward or backward by $N$ records. This is implemented by repeating the basic pointer increment/decrement operations $N$ times, rather than a direct mathematical jump.

---

### 3. When Sequential Access is Appropriate
Sequential access is highly efficient and appropriate for applications where data is naturally ordered and processed from beginning to end:

1.  **Compilers and Linkers:** Compilers parse source code files sequentially from the first line to the last line.
2.  **Audio and Video Streaming:** Media files are played sequentially. The media player decodes and renders frames in a strict timeline.
3.  **Log File Generators:** System logs (e.g., syslog, web server access logs) append new events to the end of the file. Analysis tools parse these logs sequentially.
4.  **Backups and Archiving:** Backup software copies entire directories block-by-block to an archive file sequentially.
5.  **Batch Processing:** Processing payroll or utility bills for a sequence of accounts.

---

## Q68. Describe the Direct (Random) Access method. Explain its mathematical model and contrast it with sequential access.

### 1. Conceptual Model of Direct Access
The **Direct Access** (or **Random Access**) method views a file as a numbered sequence of blocks or records. Under this model, an application can read or write to any block immediately, in any order, without scanning through preceding blocks. Direct access is built upon the physical characteristics of disk drives (magnetic disks and SSDs), which allow direct positioning of the read/write assembly to any sector.

```
       +----------+----------+----------+----------+----------+
File:  | Block 0  | Block 1  | Block 2  | Block 3  | Block 4  |
       +----------+----------+----------+----------+----------+
                                             ^
                                             |  (Direct jump to Block 3)
                                             +-- [Read/Write pointer]
```

This method is critical for database systems. For example, if a query requires record number 999, direct access allows the system to compute the block location of record 999 and fetch it immediately, rather than reading the first 998 records.

---

### 2. Mathematical Model of Direct Access
To achieve direct access, the file system must model the file as a sequence of fixed-size records. Let:
*   $R$ be the fixed size of each record in bytes.
*   $N$ be the zero-indexed record number that the application wants to access.
*   $B$ be the physical block size of the storage device.

The OS computes the exact logical byte offset ($O$) of the record using the formula:
$$O = N \times R$$

To read or write record $N$, the operating system translates the logical byte offset $O$ into a physical block number ($P$) and a byte offset within that block ($D$):
$$P = \lfloor O / B \rfloor$$
$$D = O \pmod B$$

The system then reads physical block $P$ into memory and accesses the data starting at offset $D$. The seek system call simply changes the pointer to offset $O$, executing in $O(1)$ time.

---

### 3. Contrasting Sequential and Direct Access

| Feature | Sequential Access | Direct (Random) Access |
| :--- | :--- | :--- |
| **Pointer Movement** | Moves step-by-step to the next adjacent record ($Pointer++$). | Jumps immediately to any record $N$ ($Pointer = N \times R$). |
| **Time Complexity** | $O(N)$ to access the $N$-th record. | $O(1)$ to access any record. |
| **Physical Media** | Optimal for magnetic tapes and sequential media. | Optimal for HDD and SSD (disk-based media). |
| **Record Size** | Can support variable-length records easily. | Requires fixed-length records for mathematical mapping. |
| **Primary Use Cases** | Compilers, media players, backup utilities, log writers. | Database Management Systems (DBMS), virtual machines. |
| **OS Overhead** | Low; only needs to track a single advancing pointer. | High; must maintain complex block-mapping tables. |

Using direct access, a programmer can easily simulate sequential access by incrementing the record number variable sequentially. However, simulating direct access on a sequential-only device is highly inefficient, requiring physical winding and re-winding of media.


## Q69. Explain the Indexed Access method. How does it build upon direct access to handle large databases?

### 1. The Concept of Indexed Access
The **Indexed Access** method is an advanced file access mechanism designed to locate and retrieve records quickly without scanning the entire file. It is the foundation of modern database management systems (DBMS) and Index Sequential Access Method (ISAM) files. 

While direct access requires the application to know the exact physical block number or logical record number, indexed access introduces an intermediate layer: the **index**. An index is a separate file or data structure containing key-pointer pairs. Each entry in the index maps a specific search key (e.g., Employee ID, Social Security Number) to its corresponding physical record address in the main data file.

```
       INDEX FILE (Sorted by Key)               DATA FILE (Unsorted/Sequential)
      +---------------+-------------+          +------------------------------+
      | Search Key    | Record Addr |          | Record Data                  |
      +---------------+-------------+          +------------------------------+
      | 1001          | Address A  |---------->| [Addr A] ID: 1001, Name: John|
      | 1002          | Address C  |----+      |                              |
      | 1003          | Address B  |--+ |      | [Addr B] ID: 1003, Name: Jane|
      | 1004          | Address D  |-+| |      |                              |
      +---------------+-------------++|        | [Addr C] ID: 1002, Name: Bob |
                                     ||        |                              |
                                     |+------->| [Addr D] ID: 1004, Name: Alice|
                                     +---------+------------------------------+
```

---

### 2. How Indexed Access Builds Upon Direct Access
Indexed access is not a replacement for direct access; rather, it is a higher-level abstraction built *on top* of it. 
1.  **Translating Logical Keys to Addresses:** Direct access is restricted to mathematical indexing ($Offset = N \times R$). This assumes records are ordered by record number. However, real-world database queries are based on attributes (like names or IDs). The index maps these attribute keys to block numbers.
2.  **Supporting Variable-Length Records:** Under raw direct access, variable-length records break the mathematical offset calculation. The index solves this by storing the precise byte offset of each record, allowing direct jumps to variable-size data blocks.
3.  **Handling Search Overhead:** To find a record in a large unsorted database without an index, the system must perform a sequential scan ($O(N)$ operations). By maintaining a sorted index file (e.g., using a binary search tree or B+ Tree), the search complexity is reduced to $O(\log N)$. Once the index lookup yields the address, the OS uses direct access to retrieve the block in $O(1)$ time.

---

### 3. Handling Large Databases via Multi-level Indexes
For massive databases, the index file itself can grow too large to fit into primary memory (RAM). When this happens, searching the index on disk becomes a performance bottleneck. 

To resolve this, database systems build a **multi-level index**. A primary index (outer index) is created to point to blocks of a secondary index (inner index), which in turn points to the actual data blocks. 

```
  Outer Index (In RAM)        Inner Index (On Disk)        Actual Data File (On Disk)
   +-----+-----------+        +-----+-------------+        +-------------------------+
   | Key | Index Ptr |        | Key | Record Ptr  |        | Record Data             |
   +-----+-----------+        +-----+-------------+        +-------------------------+
   | 100 | PTR A     |------> | 100 | Addr 1      |------> | [Addr 1] Key 100 Data   |
   | 200 | PTR B     |        | 120 | Addr 2      |        | [Addr 2] Key 120 Data   |
   +-----+-----------+        +-----+-------------+        +-------------------------+
```

By keeping the top-level index in memory, the system minimizes expensive disk I/O operations, ensuring highly responsive query executions even on multi-terabyte datasets.

---

## Q70. Discuss File Allocation Methods. Explain Contiguous Allocation, its advantages (e.g., speed), and disadvantages (e.g., external fragmentation).

### 1. Conceptual Model of Contiguous Allocation
The **Contiguous Allocation** method requires each file to occupy a set of physically contiguous blocks on the disk. For example, if a file starts at block $S$ and has a length of $L$ blocks, it will occupy blocks $S, S+1, S+2, \dots, S+L-1$. The directory entry for a contiguously allocated file is simple, requiring only the starting block address and the file size (length).

```
Disk Blocks:
+----+----+----+----+----+----+----+----+----+----+----+----+
| 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 |
|    |    |  [ File A ]  |    |    |     [ File B ]       |
+----+----+----+----+----+----+----+----+----+----+----+----+
File A: Start = 2, Length = 3 (Blocks 2, 3, 4)
File B: Start = 7, Length = 4 (Blocks 7, 8, 9, 10)
```

---

### 2. Advantages of Contiguous Allocation
*   **Maximum I/O Performance (Speed):** Contiguous allocation offers the fastest read/write speeds. Because the blocks are physically adjacent, disk head seek time and settling time are minimized. On magnetic hard disks, the drive can read the entire file in a single continuous rotation without moving the read/write arm.
*   **Simple Directory Structure:** The OS only needs to store the starting block address and the length of the file in the directory.
*   **Excellent Direct Access Support:** Retrieving block $i$ of a file starting at block $S$ is mathematically trivial:
    $$\text{Target Block} = S + i$$
    The OS can calculate this location immediately and request the physical sector directly.

---

### 3. Disadvantages of Contiguous Allocation
*   **External Fragmentation:** As files are created, modified, and deleted, the free disk space is broken down into small, isolated segments. If a user wants to create a new file of size $K$ blocks, and the disk has $K$ free blocks scattered in smaller chunks, the allocation will fail. Preventing this requires **compaction** (defragmentation), which involves moving all files to group free blocks together. Compaction is highly resource-intensive and time-consuming.
*   **Difficulty in Determining File Size:** When creating a file, the system or user must predict how large the file will grow. If the allocation is too small, and the block immediately following the file ($S+L$) is already occupied by another file, the file cannot grow. The OS must either:
    1.  Terminate the program with a "disk full" error.
    2.  Find a larger contiguous free area, copy the entire file there, and free the old blocks.
*   **Internal Fragmentation:** If space is allocated based on expected size, and the file remains small, the unused blocks within the contiguous run are wasted.

---

## Q71. Explain Linked Allocation. How does it solve the fragmentation problem, and what are its major drawbacks (e.g., reliability, slow random access)?

### 1. Conceptual Model of Linked Allocation
**Linked Allocation** solves the limitations of contiguous allocation by treating each file as a linked list of disk blocks. These blocks can be scattered anywhere across the physical storage media. 

Each disk block allocated to a file contains two components:
1.  The user data payload.
2.  A pointer (disk address) to the next block in the file.

The directory entry contains pointers to the **first** and **last** blocks of the file.

```
Directory Entry:
File A: Start = 9, End = 11

Disk Layout:
Block 9            Block 16            Block 1             Block 11
+-------------+    +-------------+     +-------------+     +-------------+
| Data        |    | Data        |     | Data        |     | Data        |
| Pointer: 16 |--->| Pointer: 1  |---->| Pointer: 11 |--->| Pointer: NIL|
+-------------+    +-------------+     +-------------+     +-------------+
```

---

### 2. How Linked Allocation Solves Fragmentation
*   **No External Fragmentation:** Any available free block on the disk can be allocated to any file. The OS does not need to search for contiguous space.
*   **Dynamic File Growth:** A file can grow indefinitely as long as there is at least one free block on the disk. When a file needs to expand, the OS allocates a free block from the free list, updates the pointer in the file's current last block, and updates the directory's "End Block" pointer.
*   **No Pre-declaration of Size:** Users do not need to estimate or declare the file size upon creation.

---

### 3. Major Drawbacks of Linked Allocation
*   **Inability to Support Direct Access:** Linked allocation is highly inefficient for random access. To access block $i$ of a file, the OS must start at the beginning block (from the directory) and sequentially traverse the next $i-1$ pointers, performing up to $i$ disk reads. This makes linked allocation unusable for database applications.
*   **Storage Overhead (Non-power-of-two blocks):** The pointer within each block consumes storage space (e.g., 4 bytes out of a 512-byte block). This means the actual space available for data is 508 bytes. Many operating systems and applications rely on powers of two for memory alignment (e.g., 512 bytes). This mismatch requires the OS to perform extra computational work to pack and unpack data across block boundaries.
*   **Poor Reliability:** Since the blocks are chained together, a single bad sector that corrupts a pointer breaks the link. The OS loses access to the remainder of the file, leading to severe data loss.
*   **High Seek Overhead:** Because blocks are scattered across the disk, sequential reads require the physical disk arm to traverse back and forth across tracks, dramatically slowing down throughput compared to contiguous allocation.

---

## Q72. Describe Indexed Allocation. How does it work? Discuss single-level index, linked scheme, and multilevel index (like Unix inode).

### 1. The Concept of Indexed Allocation
**Indexed Allocation** brings the benefits of both contiguous and linked allocation by storing all the pointers for a file's blocks in a single dedicated block, called the **Index Block**. 

Instead of scattering pointers throughout the data blocks (as in linked allocation) or requiring physical contiguity (as in contiguous allocation), each file has its own index block. The directory entry for a file points directly to its index block, which contains an ordered array of physical disk block addresses.

```
Directory Entry:
File A ---> Index Block: 24

Index Block (Block 24):      Disk Layout:
+---------------------+      +-----------------------------+
| Entry 0: Block 9    |----->| Block 9:   [Data Block 0]   |
| Entry 1: Block 16   |----->| Block 16:  [Data Block 1]   |
| Entry 2: Block 1    |----->| Block 1:   [Data Block 2]   |
| Entry 3: Block 11   |----->| Block 11:  [Data Block 3]   |
| Entry 4: NIL        |      +-----------------------------+
+---------------------+
```

---

### 2. Implementation Schemes for Varying File Sizes
A single index block is usually one physical disk block (e.g., 512 bytes or 4 KB). If a pointer requires 4 bytes, a 512-byte index block can hold only 128 pointers, limiting the file size to $128 \times 512 \text{ bytes} = 64 \text{ KB}$. To support larger files, three schemes are used:

#### A. Single-Level Index
The simplest implementation where the directory points to a single index block. The index block's entries map directly to the data blocks. As shown above, this is highly limited by the physical block size of the index block.

#### B. Linked Scheme
For files exceeding the limit of a single index block, multiple index blocks can be linked together. The last entry of each index block does not point to a data block; instead, it contains the physical disk address of the next index block.

#### C. Multilevel Index (Two-Level and Three-Level)
To avoid traversing a long chain of linked index blocks, a tree structure is implemented. A first-level index block points to second-level index blocks, which point to the actual data blocks. 
*   If a block holds 128 pointers, a two-level index can support:
    $$128 \times 128 = 16,384 \text{ blocks} \approx 8 \text{ MB of data}$$

```
Directory ---> First-Level Index Block
               +---------------+
               | PTR to Index A|-------> Index Block A
               | PTR to Index B|--+      +---------------+
               +---------------+  |      | PTR to Data 1 |
                                  |      | PTR to Data 2 |
                                  |      +---------------+
                                  v
                                 Index Block B
                                 +---------------+
                                 | PTR to Data 3 |
                                 +---------------+
```

#### D. Combined Scheme (Unix Inode)
Unix-like file systems use a combined allocation scheme. An inode (index node) contains 15 pointers:
*   **Direct Pointers (12):** Point directly to data blocks. Great for small files (up to 48 KB).
*   **Single Indirect Pointer (1):** Points to an index block containing data block pointers.
*   **Double Indirect Pointer (1):** Points to an index block containing pointers to second-level index blocks.
*   **Triple Indirect Pointer (1):** Points to a third-level index block, allowing support for files up to multiple terabytes.

---

## Q73. Discuss Free Space Management techniques, including Bit Vectors (Bitmaps), Linked Lists, Grouping, and Counting.

To allocate disk blocks to files, the operating system must maintain a **Free Space List** tracking all unallocated blocks. The four primary techniques used to manage this space are:

---

### 1. Bit Vector (Bitmap)
The disk space is represented by a sequence of bits, where each bit corresponds to a physical block.
*   `1` indicates the block is free.
*   `0` indicates the block is allocated.

For example, a disk where blocks 2, 3, 4, 5, 8, 9, and 10 are free would be represented as:
$$\text{Bitmap} = 00111100111000\dots$$

*   **Advantages:** 
    *   Highly efficient in finding the first free block or a contiguous group of free blocks using CPU bit-manipulation instructions (e.g., search for the first non-zero byte).
*   **Disadvantages:**
    *   The entire bitmap must be kept in RAM to remain fast. For a 1 TB disk with 4 KB blocks:
        $$\text{Number of Blocks} = \frac{10^{12} \text{ bytes}}{4096 \text{ bytes}} \approx 244,140,625 \text{ blocks}$$
        $$\text{Bitmap Size} = \frac{244,140,625 \text{ bits}}{8 \text{ bits/byte}} \approx 30.5 \text{ MB of RAM}$$
        This memory overhead becomes significant as disk sizes grow.

---

### 2. Linked List
All free disk blocks are linked together. The OS maintains a head pointer to the first free block in secondary memory. Each free block contains a pointer to the next free block.

```
Free Pointer ---> Block 2          Block 3          Block 8
                  +------------+   +------------+   +------------+
                  | Free Data  |   | Free Data  |   | Free Data  |
                  | Pointer: 3 |--->| Pointer: 8 |--->| Pointer: 9 |---> ...
                  +------------+   +------------+   +------------+
```

*   **Advantages:**
    *   No RAM overhead; pointers are stored inside the free blocks themselves.
*   **Disadvantages:**
    *   Highly inefficient for traversing. To find contiguous free blocks, the OS must read blocks sequentially from disk, causing massive disk head movements.

---

### 3. Grouping
A modification of the linked list method. The first free block stores the physical addresses of $n$ free blocks. 
*   The first $n-1$ of these pointers point to actual free blocks.
*   The $n$-th pointer points to another block that contains the addresses of the next $n$ free blocks.

```
First Free Block
+-----------------------+
| Ptr 1: Block 3        |
| Ptr 2: Block 4        |
| Ptr 3: Block 8        | (Next index block)
| Ptr 4: Block 15       |-------------------------> Block 15:
+-----------------------+                           +-----------------+
                                                    | Ptr 1: Block 16 |
                                                    | Ptr 2: Block 17 |
                                                    +-----------------+
```

This allows the OS to quickly fetch the addresses of a large number of free blocks with a single disk read.

---

### 4. Counting
This technique takes advantage of the fact that multiple contiguous blocks are often freed or allocated simultaneously (especially when using contiguous allocation). 
Rather than keeping a list of all free block numbers, the system maintains:
1.  The address of the first free block.
2.  A count ($C$) indicating how many contiguous blocks following it are also free.

Each entry in the free-space list looks like:
$$\text{Entry} = \langle \text{First Free Block Address}, \text{Count} \rangle$$

This significantly reduces the size of the free-space list and behaves similarly to segments in memory management.


## Q74. Explain the Single-Level Directory system. Discuss its structure, naming conflicts, and grouping limitations.

### 1. Conceptual Structure and Entry Mechanics
The **Single-Level Directory** system is the simplest directory design. In this model, all files in the entire file system reside in a single, flat directory table. There are no subdirectories, user folders, or hierarchical divisions. Every file is represented by a single row in the directory table that directly maps a human-readable name to its physical storage details.

```
       +-------------------------------------------------+
       |                SINGLE DIRECTORY                 |
       +-------------------------------------------------+
       | cat.txt | dog.bin | test.o | report.doc | src.c |
       +----+----+----+----+----+----+----+------+----+---+
            |         |         |         |          |
            v         v         v         v          v
         [File]    [File]    [File]    [File]     [File]
```

Under the hood, each entry in the directory file has a fixed structure containing attributes like:
*   **File Name:** The character string identifying the file.
*   **File Type:** E.g., system, application, text, or data.
*   **Physical Address:** The starting block number or inode index.
*   **Size:** The current size of the file on disk.
*   **Protection Flags:** Basic access control bits.

Because the system is flat, every search, insertion, and deletion operates directly on this single file list.

---

### 2. Naming Conflicts in Multi-User Systems
The most critical failure of the single-level directory is the lack of protection against **naming conflicts**. Because all files share a single, global namespace, no two files can have the same name.
*   **The Shared Lab Example:** Imagine a university laboratory server where 100 students are writing programs for an Operating System course. If Student A saves their work as `main.c`, no other student on that system can name their file `main.c`. If Student B attempts to save a file named `main.c`, the OS will either reject the write or, worse, overwrite Student A's work without warning.
*   **Scale and Naming Fatigue:** As the number of files increases, users must create increasingly complex, artificial names (e.g., `user1_project1_v3_final_main.c`) to avoid colliding with other users' files.
*   **Temporary File Collision:** Many software compilers, interpreters, and system tasks create temporary intermediate files (like `temp.txt` or `a.out`). In a flat system, if multiple users run a compiler concurrently, their temporary files will continuously overwrite one another, leading to program crashes and data corruption.

---

### 3. Grouping and Access Limitations
The flat architecture places severe constraints on how data can be organized and secured:
*   **No File Organization:** A single user cannot group related files together. For example, personal documents, system executables, source code files, and games must all sit in one massive, chaotic list. 
*   **Linear Search Overhead ($O(N)$):** To find a file, the OS must perform a linear scan from the beginning of the single directory file to the end. For a system with thousands of files, this creates significant disk I/O bottlenecks.
*   **Access Control and Security Failures:** Since there is no directory partitioning, all users have access to the same directory table. Any user can list, read, modify, or delete any other user's files. The OS cannot easily hide files belonging to one user from another, making the system fundamentally insecure.

---

## Q75. Explain the Two-Level Directory system. How does it solve naming conflicts between different users?

### 1. Conceptual Structure and Lookup Process
To resolve the naming conflicts inherent in a flat namespace, the **Two-Level Directory** system introduces a two-tier directory tree. This structure separates administrative control from individual user files:
1.  **Master File Directory (MFD):** The root directory of the file system. The MFD is indexed when a user logs into the system. Each entry in the MFD points directly to a private directory dedicated to that specific user.
2.  **User File Directory (UFD):** A private, secondary-level directory created automatically for each user. It contains entries for that user's files, mapping the local filenames to their physical disk addresses.

```
                  +-----------------------------------+
                  |      Master File Directory (MFD)  |
                  +-----------------------------------+
                  |   User A   |   User B   |  User C |
                  +-----+------+-----+------+----+----+
                        |            |           |
       +----------------+            |           +--------------+
       v                             v                          v
+--------------+              +--------------+           +--------------+
| UFD (User A) |              | UFD (User B) |           | UFD (User C) |
+--------------+              +--------------+           +--------------+
| test | data  |              | test | notes |           | main | data  |
+--+---+---+---+              +--+---+---+---+           +--+---+---+---+
   |       |                     |       |                  |       |
   v       v                     v       v                  v       v
[File]   [File]               [File]   [File]            [File]   [File]
```

When a user logs in, the operating system reads their username, searches the MFD to locate their UFD, and stores a pointer to this UFD in the process control block (PCB). All subsequent file creation, reading, and writing requests default to this UFD.

---

### 2. Solving Naming Conflicts Between Users
The two-level directory system resolves naming conflicts through **UFD isolation**:
*   **Independent Namespaces:** Since each user has their own private UFD, there is no global namespace collision. User A can create a file named `test` in their UFD, and User B can create a file named `test` in their UFD. The OS does not flag a naming conflict because the two files occupy distinct physical directory structures.
*   **Logical Path Resolution:** Under this system, a file is uniquely identified not just by its filename, but by its username combined with its filename. The OS maps these requests using a path structure:
    $$\text{File Request} \implies \text{/UFD\_Name/Filename}$$
    When User A accesses `test`, the OS maps it to `/UserA/test`. When User B accesses `test`, the OS resolves it to `/UserB/test`.

---

### 3. System File Access and Internal Limitations
While isolation solves namespace collisions, it introduces new functional challenges:
*   **The System Utilities Dilemma:** If every user is completely confined to their UFD, they cannot access standard system programs (e.g., text editors, compilers, or utilities like `ls`). Copying these files into every user's UFD would waste massive amounts of disk space.
    *   *Solution:* The OS introduces a special **System UFD** (e.g., `/sys/`). When a file request is made, the OS search routine checks the user's UFD first. If the file is not found, the OS checks the System UFD. This sequence is known as the **search path**.
*   **No Multi-Level Organization:** The major limitation is that a user still cannot organize files *within* their own UFD. A student working on five different courses must dump all files into their single UFD, leading to naming conflicts and search clutter for that individual user.

---

## Q76. Describe the Tree-Structured Directory system. Discuss pathnames (absolute vs. relative) and directory operations (creating/deleting directories).

### 1. Conceptual Structure and Directory Files
The **Tree-Structured Directory** system is the standard for modern operating systems (e.g., Windows NTFS, Linux ext4). It organizes files in a hierarchical, multi-level tree structure. In this model, directories are treated as special files. Instead of holding application data, a directory file contains a table of names and associated pointers to other files or subdirectories.

```
                              [ Root (/) ]
                             /            \
                       [ home ]          [ bin ]
                      /        \            |
                 [ userA ]   [ userB ]    [ ls ] (File)
                 /       \       |
          [ project ]  [doc.txt] [test] (File)
          /         \    (File)
    [ src.c ]   [ out.o ]
     (File)      (File)
```

The top of the hierarchy is the **Root Directory** (denoted as `/` in Unix-like systems and `C:\` in Windows). All internal nodes in the tree represent directories, while the leaf nodes represent data files. This structure allows users to create nested subdirectories to group and organize files dynamically.

---

### 2. Pathnames and Path Resolution
To access a file, the OS must resolve its path. Pathnames are classified into two types:
*   **Absolute Pathname:** Specifies the complete path starting from the root directory. It uniquely identifies the file, regardless of the process's current environment.
    *   *Example:* `/home/userA/project/src.c`
*   **Relative Pathname:** Specifies the path starting from the process's **Current Working Directory (CWD)**. The CWD is maintained in the process's state in memory, allowing users to avoid typing long pathnames.
    *   *Example:* If the CWD is `/home/userA`, the relative path is `project/src.c`.
    *   **Special Pointers:** Every directory includes two implicit entries:
        *   `.` points to the directory itself.
        *   `..` points to the parent directory.

#### The Path Resolution Process
When a process opens a file using an absolute path `/home/userA/doc.txt`, the OS performs the following sequential reads:
1.  **Read Root Inode:** Locates the block addresses for the root directory.
2.  **Read Root Data Block:** Searches for the string `"home"` to find its corresponding inode number.
3.  **Read "home" Inode:** Locates the block addresses for the `/home` directory.
4.  **Read "home" Data Block:** Searches for the string `"userA"` to find its inode number.
5.  **Read "userA" Inode:** Locates the block addresses for `/home/userA`.
6.  **Read "userA" Data Block:** Searches for `"doc.txt"` to find the target file's inode and load its data blocks.

---

### 3. Directory Operations
Operating systems provide system calls to manage this hierarchical tree structure:

*   **Creating a Directory (mkdir):**
    1.  The OS calls the free-space manager to allocate a disk block for the new directory.
    2.  It initializes this block with the basic entries: `.` pointing to the allocated block, and `..` pointing to the parent directory's block.
    3.  It updates the parent directory's data block by adding a new name-pointer pair mapping the directory name to the new block.
*   **Deleting a Directory (rmdir):**
    *   *Strict Approach:* The directory can only be deleted if it is empty (contains only `.` and `..`). If files exist, the OS returns an error, forcing the user to delete files first.
    *   *Recursive Approach (e.g., `rm -rf`):* The OS automatically deletes all files and nested subdirectories in the target path recursively, releasing their blocks back to the free-space manager.

---

## Q77. Explain Acyclic-Graph Directories and General Graph Directories. Discuss the challenges of shared files and cycles (garbage collection).

### 1. Acyclic-Graph Directories
An **Acyclic-Graph Directory** is a directory structure that extends the tree structure by allowing directories and files to be shared among multiple paths, provided that the sharing does not form any cycles (loops). This is essential for collaborative environments where two users need to access and modify the same file or folder.

```
                              [ Root ]
                             /        \
                       [ User A ]   [ User B ]
                        /        \  /
                   [ File A ]   [ Shared Folder ]
                                 /            \
                            [ File B ]     [ File C ]
```

#### Sharing Mechanisms
1.  **Symbolic Links (Soft Links):** A special file type containing a path string pointing to another file. When the OS reads the link, it resolves the path string to locate the target.
2.  **Hard Links:** Multiple directory entries point directly to the same internal metadata structure (e.g., the same inode or FCB).

---

### 2. General Graph Directories
A **General Graph Directory** allows cycles to exist within the directory structure. A cycle occurs when a directory contains a link (directly or indirectly) back to one of its ancestors (e.g., a subdirectory pointing to `/home`).

```
    [ Root ] ---> [ User A ] ---> [ Project ]
      ^                                |
      |________________________________|  (Cycle Link)
```

---

### 3. Challenges and Solutions

#### A. The Shared Files Deletion Problem (Acyclic Graph)
When a shared file is deleted by one user, the system must decide what happens to the physical file and the other users' links:
*   *For Hard Links:* The OS maintains a **reference count** in the file's inode. When a user deletes their reference, the reference count is decremented:
    $$\text{RefCount}_{\text{new}} = \text{RefCount}_{\text{current}} - 1$$
    The physical file blocks are only freed when the reference count reaches 0.
*   *For Symbolic Links:* If the owner deletes the target file, the file is immediately removed. The symbolic links owned by other users remain on disk but point to a non-existent path, creating **dangling pointers**.

#### B. Search Loops and Infinite Traversal (General Graph)
When a cycle exists, traversal algorithms (such as file search utilities, disk usage calculators, or backup software) can enter infinite loops, repeatedly reading the same directory structure. 
*   *Solution:* Algorithms must keep track of all visited nodes (e.g., maintaining a hash set of visited inode numbers) during search operations.

#### C. Garbage Collection of Cyclic Structures
If a set of directories and files form a cycle (e.g., Directory A points to B, and B points to A) but all external links from the root are severed, the reference counts of A and B remain at 1. Under standard reference counting, these blocks will never be reclaimed, causing a memory leak.
*   *Solution:* The OS must run a **garbage collection** process. This involves periodically traversing the directory tree from the root, marking all reachable files (Mark-and-Sweep). Any blocks not marked are identified as unreachable and reclaimed, regardless of their reference count.

---

## Q78. What is File Protection? Discuss access control lists (ACLs) and the owner/group/universe permission scheme (e.g., Unix chmod).

### 1. The Concept of File Protection
**File Protection** refers to the mechanisms used to secure files against unauthorized access, corruption, or destruction. An operating system must control what operations a specific user can perform on a file. The basic operations that require authorization checks include:
*   **Read:** Reading the contents of the file.
*   **Write:** Modifying or appending data.
*   **Execute:** Running an executable file or script.
*   **Append:** Adding data to the end of the file.
*   **Delete:** Removing the file.
*   **List:** Viewing the file names inside a directory.

---

### 2. Access Control Lists (ACLs)
An **Access Control List (ACL)** is a file protection mechanism where each file and directory is associated with a list. This list specifies all users (and groups) and their precise permissions for that file.

```
File: payroll.xlsx
Access Control List:
+---------------+------------------------+
| User/Group    | Permissions            |
+---------------+------------------------+
| User: Alice   | Read, Write, Delete   |
| User: Bob     | Read                   |
| Group: HR     | Read, Write            |
| User: Charlie | None                   |
+---------------+------------------------+
```

*   **Advantages:**
    *   Fine-grained security. It allows administrators to assign highly specific permissions to individual users.
*   **Disadvantages:**
    *   *Storage Overhead:* Storing a list of arbitrary length for every file consumes significant disk space.
    *   *Performance Impact:* Reading and parsing the ACL for every file access check adds search and processing overhead.

---

### 3. Owner/Group/Universe Scheme (Unix Permissions)
To solve the overhead of ACLs, Unix-like systems implement a compact, fixed-size permission scheme. Users are classified into three roles:
1.  **Owner (User - `u`):** The user who created the file.
2.  **Group (`g`):** A collection of users sharing similar access rights (e.g., team members working on a project).
3.  **Universe (Others - `o`):** All other users on the system.

For each category, three permission bits are tracked: Read (`r`), Write (`w`), and Execute (`x`). This requires only 9 bits (plus optional system bits like SUID/SGID) stored in the inode.

```
       User (Owner)            Group                 Others
      +-------------+      +-------------+      +-------------+
Bits: |  r  |  w  |  x  |      |  r  |  w  |  x  |      |  r  |  w  |  x  |
      +-----+-----+-----+      +-----+-----+-----+      +-----+-----+-----+
Val:     4     2     1            4     2     1            4     2     1
```

#### Numeric (Octal) Representation
Permissions are often represented as a 3-digit octal number, where each digit is the sum of the active permission values ($r=4, w=2, x=1$):
*   `7` ($4+2+1$) $\implies$ Read, Write, and Execute (`rwx`).
*   `6` ($4+2$) $\implies$ Read and Write (`rw-`).
*   `5` ($4+1$) $\implies$ Read and Execute (`r-x`).
*   `4` ($4$) $\implies$ Read-only (`r--`).

#### The `chmod` Utility
The `chmod` system utility changes these bits:
*   `chmod 755 script.sh` sets the permissions to `rwxr-xr-x` (Owner can do everything; group and others can read and execute).
*   `chmod 600 private.txt` sets the permissions to `rw-------` (Only the owner can read and write; all others have no access).


## Q79. Discuss disk space allocation using the FAT (File Allocation Table) file system. How does it combine linked and table-based allocation?

### 1. Conceptual Model of FAT
The **File Allocation Table (FAT)** file system is a classic architecture developed by Microsoft and used widely in MSDOS, early versions of Windows, and modern portable media (like USB drives via FAT32). 

Under FAT, the disk's data area is divided into fixed-size units called **clusters**. At the beginning of the volume, the system allocates a dedicated, centralized table called the **File Allocation Table**. The table contains one entry for each physical cluster on the disk. The entries are indexed by cluster number.

```
Directory Entry:
+-------------------+-------------+
| File Name: memo   | Start: 0002 |
+-------------------+-------------+

File Allocation Table (FAT):
+---------------+------------------------+
| Cluster Index | Value / Next Pointer   |
+---------------+------------------------+
| 0000          | Free                   |
| 0001          | Allocated/Reserved     |
| 0002          | 0005                   | ---> (memo starts at 2, next is 5)
| 0003          | Free                   |
| 0004          | 0008                   |
| 0005          | 0007                   | ---> (next cluster is 7)
| 0006          | Free                   |
| 0007          | EOF (0xFFF)            | ---> (End of File)
| 0008          | EOF (0xFFF)            |
+---------------+------------------------+
```

---

### 2. Combining Linked and Table-Based Allocation
FAT is essentially a variation of **linked allocation**, but it solves the core drawbacks of raw linked lists by decoupling the pointers from the data blocks:

*   **Extraction of Pointers:** In standard linked allocation, each disk block contains a physical pointer to the next block, leaving non-power-of-two spaces for user data. FAT extracts these pointers from the data blocks and aggregates them into the centralized File Allocation Table.
*   **Pure Data Blocks:** Because pointers are moved to the table, data blocks (clusters) contain 100% user data. This maintains power-of-two cluster sizes (e.g., 2 KB, 4 KB), aligning perfectly with system memory buffers.
*   **In-Memory Traversal (Random Access Optimization):** In raw linked allocation, finding block $i$ requires reading all preceding blocks from disk to find the pointers. With FAT, the OS caches the File Allocation Table in RAM. The OS can traverse the entire link chain in memory ($O(N)$ table operations but $O(0)$ disk access) to find the target cluster's physical address. Once found, it performs a single direct disk I/O operation to read the cluster.

---

### 3. Drawbacks of the FAT System
*   **Memory Overhead:** The FAT must be cached in RAM to ensure fast operations. As disks grow, the table size increases. For example, a 100 GB disk with 4 KB clusters requires:
    $$\text{Entries} = \frac{100 \times 10^9 \text{ bytes}}{4096 \text{ bytes}} \approx 24.4 \times 10^6 \text{ entries}$$
    Using 32-bit (4-byte) entries, the table requires $\approx 97.6 \text{ MB}$ of RAM.
*   **Vulnerability to Corruption:** Since the FAT governs all file block locations, corruption of the table renders the entire file system unreadable. To mitigate this, systems maintain duplicate copies (e.g., FAT1 and FAT2) on disk.

---

## Q80. Explain the internal structure and design of the Unix Inode system for file block allocation. How does it handle files of varying sizes?

### 1. The Inode Structure
In Unix-like file systems (such as UFS, ext2, ext3, and ext4), each file and directory is represented by a data structure called an **inode** (index node). The inode contains all the metadata for a file (owner, permissions, timestamps, size) except for the file's name, which is stored in the directory entry.

To manage space allocation, the inode contains an array of block pointers (typically 15 pointers total). This layout is designed to handle files ranging from a few bytes to hundreds of gigabytes efficiently.

```
       UNIX INODE
+-----------------------+
| File Metadata         |
| (Permissions, Size...) |
+-----------------------+
| Direct Ptr 0 - 11     | ------> [Data Block 0] ... [Data Block 11]
+-----------------------+
| Single Indirect Ptr   | ------> [Index Block]
+-----------------------+         |---> [Data Block 12] ...
| Double Indirect Ptr   | ------> [First-level Index Block]
+-----------------------+         |---> [Second-level Index Block] ---> [Data Block...]
| Triple Indirect Ptr   | ------> [First-level Index Block]
+-----------------------+         |---> [Second-level] ---> [Third-level] ---> [Data]
```

---

### 2. Handling Files of Varying Sizes
The 15 pointers in the inode are categorized into four levels of indexing:

#### A. Direct Pointers (Pointers 0 to 11)
The first 12 pointers point directly to the physical disk blocks containing the file's data. 
*   If the block size is 4 KB, these direct pointers can reference up to:
    $$12 \times 4 \text{ KB} = 48 \text{ KB of data}$$
*   *Optimization:* Most files on a typical operating system are small. Direct pointers allow these files to be read with zero index-block overhead, yielding maximum performance.

#### B. Single Indirect Pointer (Pointer 12)
Points to an index block that contains pointers to data blocks.
*   If a pointer requires 4 bytes, a 4 KB index block can hold:
    $$\frac{4096 \text{ bytes}}{4 \text{ bytes}} = 1024 \text{ pointers}$$
*   This single indirect pointer supports an additional:
    $$1024 \times 4 \text{ KB} = 4 \text{ MB of data}$$

#### C. Double Indirect Pointer (Pointer 13)
Points to a first-level index block, which points to 1024 second-level index blocks. Each second-level index block points to 1024 data blocks.
*   This supports:
    $$1024 \times 1024 \times 4 \text{ KB} = 1024^2 \times 4 \text{ KB} = 4 \text{ GB of data}$$

#### D. Triple Indirect Pointer (Pointer 14)
Points to a first-level index block, pointing to 1024 second-level index blocks, pointing to 1024 third-level index blocks, pointing to 1024 data blocks.
*   This supports:
    $$1024^3 \times 4 \text{ KB} = 4 \text{ TB of data}$$

---

### 3. Advantages of the Inode Design
*   **Dynamic Depth:** The system scales the indexing depth to match the file's size. Tiny files have zero indirect disk I/O overhead. Large files have access times that scale with the log of their size.
*   **Efficient Space Utilization:** Index blocks are allocated dynamically only when the file grows to require them.

---

## Q81. Compare and contrast Contiguous, Linked, and Indexed allocation methods based on access speed, storage overhead, and fragmentation.

The choice of file allocation method directly impacts file access latency, storage efficiency, and the frequency of system maintenance tasks. The table and sections below compare the three primary allocation schemes:

---

### 1. Comparative Matrix

| Comparison Criteria | Contiguous Allocation | Linked Allocation | Indexed Allocation |
| :--- | :--- | :--- | :--- |
| **Sequential Access Speed** | **Fastest:** Continuous read/write without seek overhead. | **Slow:** Requires traversing scattered blocks. | **Moderate/Fast:** Requires parsing index blocks. |
| **Random (Direct) Access Speed** | **Fastest:** Simple mathematical calculation ($O(1)$). | **Extremely Slow:** Must traverse chain sequentially ($O(N)$). | **Fast:** $O(1)$ lookup in cached index blocks. |
| **Storage Overhead** | **Lowest:** Requires only starting block and length. | **Low:** Pointer per block or FAT entry. | **Highest:** Requires allocating whole index blocks. |
| **External Fragmentation** | **Severe:** Requires regular compaction. | **None:** Any free block can be allocated. | **None:** Any free block can be allocated. |
| **Internal Fragmentation** | **Low:** Only occurs in the last allocated block. | **Low:** Only in the last block of the file. | **High:** Wasted space in partially-filled index blocks. |
| **File Growth Flexibility** | **Poor:** Cannot expand easily if adjacent block is full. | **Excellent:** Files grow block-by-block. | **Excellent:** Files grow until index limits are hit. |

---

### 2. Access Speed Analysis
*   **Contiguous Allocation:** This method offers the best sequential access speed because the data blocks are physically adjacent. On mechanical hard drives (HDDs), this minimizes disk head movement, avoiding track-to-track seek latency. For Solid State Drives (SSDs), it maximizes read throughput by exploiting sequential memory block reads. Direct access is also optimal since block $i$ is found via the $O(1)$ formula: $S + i$.
*   **Linked Allocation:** Highly inefficient for random access. To access the $100\text{-th}$ block of a file, the OS must read the first 99 blocks sequentially from disk to retrieve their pointers. Seek operations on mechanical disks cause severe disk thrashing as the read/write head jumps back and forth across different tracks.
*   **Indexed Allocation:** Balances the speed trade-offs. It supports random access in $O(1)$ time by querying the index block directly. Although it requires an initial read of the index block itself, caching the index block in RAM (a standard OS feature) makes random access almost as fast as contiguous allocation.

---

### 3. Storage Overhead Analysis
*   **Contiguous Allocation:** Wastes virtually no space on metadata overhead. The directory only stores two variables: the start block address and the file length.
*   **Linked Allocation:** Incurs a minor overhead. For example, if a 4-byte pointer is stored in each 512-byte block, the metadata overhead is:
    $$\text{Overhead} = \frac{4 \text{ bytes}}{512 \text{ bytes}} \approx 0.78\%$$
    However, this minor overhead creates memory alignment issues for programmers because the usable data payload size (508 bytes) is not a power of two.
*   **Indexed Allocation:** Incurs significant storage overhead. Every file must have an index block, even if the file is only a few bytes in size. For a 1 KB file, the OS must allocate two physical blocks: one data block and one index block. This results in a $100\%$ storage overhead for small files.

---

### 4. Fragmentation Characteristics
*   **External Fragmentation:** Only affects contiguous allocation. As files of varying sizes are created and deleted, the free space becomes divided into tiny gaps. A file creation request will fail if a single contiguous gap of the required size cannot be found, even if the sum of all free gaps is large. This requires regular defragmentation (compaction).
*   **Internal Fragmentation:** All three systems experience internal fragmentation in their last data block (wasting, on average, half a block per file). However, indexed allocation suffers from additional internal fragmentation in its index blocks. If an index block holds 1024 pointers, and a file only uses 3 blocks, the index block contains 1021 unused pointers, wasting $1021 \times 4 \text{ bytes} \approx 4 \text{ KB}$ of metadata storage.

---

## Q82. Discuss Directory Implementation techniques, specifically Linear List and Hash Table, comparing their performance in file lookup.

To locate a file, the operating system must search its directory structure. The directory maps human-readable names to internal metadata locations (like inodes or file allocation table entries). Two main directory implementations are used:

---

### 1. Linear List
In a **Linear List** implementation, directory entries are stored as a contiguous array or a linked list of filename-pointer structures. 

```
Directory Block (Linear List):
+----------------------+--------------------+
| Filename             | Inode Pointer      |
+----------------------+--------------------+
| index.html           | Inode #456         |
| style.css            | Inode #457         |
| script.js            | Inode #890         |
+----------------------+--------------------+
```

*   **Lookup Operation ($O(N \times L)$):** To find a file, the OS must perform a linear search from the beginning of the list, comparing the target string with each entry. If $N$ is the number of files and $L$ is the average length of the filename string, each comparison takes $O(L)$ time. The total lookup complexity is $O(N \times L)$.
*   **Insertion Operation ($O(N)$):** To create a new file, the OS must first verify that the filename is unique. This requires a full search of the entire list ($O(N)$). If the name is unique, the OS appends the entry to the end ($O(1)$).
*   **Deletion Operation ($O(N)$):** The OS searches for the target file name ($O(N)$), marks the entry slot as free (e.g., using a special marker byte), or shifts the trailing entries to fill the gap.
*   **Pros:** Very simple to implement. Requires minimal memory overhead for small directories.
*   **Cons:** Extremely slow for large directories (e.g., a folder containing 10,000 files).

---

### 2. Hash Table
A **Hash Table** implementation uses a hash function to transform the filename string into an integer index. This index points directly to a slot in a directory lookup table.

```
Filename: "style.css" ---> [ Hash Function ] ---> Index: 3

Hash Table:
+-------+--------------------+
| Slot  | Entry Data         |
+-------+--------------------+
| 0     | Empty              |
| 1     | Inode #456         |
| 2     | Empty              |
| 3     | Inode #457         | ---> (style.css entry)
+-------+--------------------+
```

*   **Lookup Operation ($O(1)$ average):** The OS hashes the filename and checks the corresponding index slot immediately. This eliminates the need to scan other entries.
*   **Insertion and Deletion ($O(1)$ average):** Operations are performed directly at the computed hash slot.
*   **Collision Resolution:** If two different filenames hash to the same index slot (a collision), the system handles it by creating a linked chain of entries at that slot (chaining). Searching then involves traversing this short list of collided entries.
*   **Cons:**
    *   *Fixed Table Size:* Hash tables are usually designed with a fixed size. If the directory grows beyond this capacity, collisions increase, and performance degrades toward $O(N)$ linear scans.
    *   *Rehashing Overhead:* To maintain performance, the OS must dynamically resize and rehash the directory table when it gets full, which is a slow and resource-intensive operation.

---

### 3. Real-World Design: Hashed B-Trees (HTree)
Modern high-performance file systems, such as Linux ext4, do not use simple linear lists or single flat hash tables. Instead, they use a hybrid approach called **hashed B-trees** (specifically, **HTree**). 

An HTree uses the hash value of the filename to navigate a balanced constant-depth tree. This design combines the benefits of both techniques: it provides $O(1)$ lookups like a hash table, but can grow dynamically to support millions of files without the rehashing bottlenecks associated with flat hash tables.
