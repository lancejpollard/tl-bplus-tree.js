
# TL-B+Tree in JavaScript

- `k` is a key store B+tree
- `v` is a key-value store B+tree
- `i` is an index based B+tree
- `s` is an stack/queue based B+tree

These are from the help of [@trincot](https://stackoverflow.com/users/5459839/trincot) on StackOverflow. Used as a reference implementation for various B+trees, with the added constraint that all arrays are powers of two sized, to optimize for memory layout.

Goal would be, in a multithreaded environment, to make this work with concurrent B+trees like _[PALM: Parallel Architecture-Friendly Latch-Free Modifications to B+ Trees on Many-Core Processors](http://www.vldb.org/pvldb/vol4/p795-sewall.pdf)_.
