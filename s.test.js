
  /* Below this point: these methods are optional */
Tree.prototype[Symbol.iterator] = function*() { // Make tree iterable
    let i = 0;
    for (let node = this.first; node; node = node.next) {
        for (let i = 0; i < node.childCount; i++) yield node.children[i];
    }
}
Tree.prototype.verify = function() {
    // Raise an error when the tree violates one of the required properties
    if (!this.root) return; // An empty tree is fine.
    if (this.root.parent) throw "root should not have a parent";
    // Perform a breadth first traversal
    let q = [this.root];
    while (q.length) {
        if (q[0].isLeaf() && this.first !== q[0]) throw "this.first is not pointing to first leaf";
        let level = [];
        let last = null;
        for (let parent of q) {
            if (!(parent instanceof Node)) throw "parent is not instance of Node";
            if (parent.children.length > this.nodeCapacity) throw "node's children array is too large";
            if (parent.childCount > 0 && parent.childCount * 2 <= parent.children.length) throw "node's fill ratio is too low";
            for (let i = parent.childCount; i < parent.children.length; i++) {
                if (parent.children[i] !== null) throw "child beyond childCount should be null but is not";
            }
            let treeSize = parent.treeSize;
            if (parent.isLeaf()) {
                for (let value of parent.children.slice(0, parent.childCount)) {
                    if (value === null) throw "leaf has a null as value";
                    if (value instanceof Node) throw "leaf has a Node as value";
                }
                if (parent.treeSize !== parent.childCount) throw "leaf has mismatch in treeSize and childCount";
            } else {
                for (let node of parent.children.slice(0, parent.childCount)) {
                    if (node === null) throw "internal node has a null as value";
                    if (!(node instanceof Node)) throw "internal node has a non-Node as value";
                    if (node.parent !== parent) throw "wrong parent";
                    if (node.prev !== last) throw "prev link incorrect";
                    if (last && last.next !== node) throw "next link incorrect";
                    if (last && last.children.length + node.children.length <= this.nodeCapacity) {
                        throw "two consecutive siblings have a total number of children that is too small";
                    }
                    if (node.childCount * 2 < this.nodeCapacity) {
                        throw "internal node is too small: " + node;
                    }
                    level.push(node);
                    last = node;
                    treeSize -= node.treeSize;
                }
                if (treeSize) throw "internal node treeSize sum mismatches";
            }
        }
        if (last && last.next) throw "last node in level has a next reference";
        q = level;
    }
}
Tree.prototype.test = function(count=100, option=3) {
    // option:
    //     0 = always insert & delete at left side (offset 0)
    //     1 = always insert & delete at right side
    //     2 = always insert & delete at middle
    //     3 = insert & delete at random offsets
    // Create array to perform the same operations on it as on the tree
    let arr = [];
    // Perform a series of insertions
    for (let i = 0; i < count; i++) {
        // Choose random insertion index
        let index = Math.floor(Math.random() * (i+1));
        // Perform same insertion in array and tree
        if (Math.random() < 0.5) {
            arr.push(i);
            this.push(i);
        } else {
            arr.unshift(i);
            this.unshift(i);
        }
        // Verify tree consistency and properties
        this.verify();
        // Verify the order of values in the array is the same as in the tree
        if (arr+"" !== [...this]+"") throw i + ": tree not same as array";
    }
    // Perform a series of deletions and insertions
    for (let i = arr.length - 1; i >= 0; i--) {
        // Choose random deletion index
        let index = [0, i, i >> 1, Math.floor(Math.random() * (i+1))][option];
        // Perform same deletion in array and tree
        if (Math.random() < 0.6) {
            if (Math.random() < 0.5) {
                if (arr.pop(i) !== this.pop(i)) throw "pop returns different value";
            } else {
                if (arr.shift(i) !== this.shift(i)) throw "shift returns different value";
            }
        } else {
            if (Math.random() < 0.5) {
                arr.push(i);
                this.push(i);
            } else {
                arr.unshift(i);
                this.unshift(i);
            }
        }
        // Verify tree consistency and properties
        this.verify();
        // Verify the order of values in the array is the same as in the tree
        if (arr+"" !== [...this]+"") throw "tree not same as array";
    }
    return this;
}

// Perform 1000 insertions, with either push or unshift,
// then a mix of 1000 insertions/removals, the latter with either pop or shift.
new Tree(8).test(1000);
console.log("all tests completed");