
const Tree = require('./v')
const { Node, KeyValue } = Tree

  /* Below this point: these methods are optional */
Tree.prototype[Symbol.iterator] = function*() { // Make tree iterable, yielding key/value pairs
    for (let node = this.first; node; node = node.next) {
        for (let i = 0; i < node.childCount; i++) yield [node.children[i].key, node.children[i].value];
    }
}

Tree.prototype.verify = function() {
    // Raise an error when the tree violates one of the required properties
    if (!this.root || !this.root.childCount) return; // An empty tree is fine.
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
            if (parent.isLeaf()) {
                if (parent.children[0].key !== parent.key) throw "key does not match with first child value";
                for (let value of parent.children.slice(0, parent.childCount)) {
                    if (value === null) throw "leaf has a null as value";
                    if (!(value instanceof KeyValue)) throw "leaf has a non-KeyValue item";
                }
            } else {
                if (parent.children[0].key !== parent.key) throw "key does not match with first child's key";
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
                }
            }
        }
        if (last && last.next) throw "last node in level has a next reference";
        q = level;
    }
}

Tree.prototype.test = function(count=100) {
    const isEqual = () =>
        JSON.stringify([...map].sort((a,b) => a[0]-b[0])) === JSON.stringify([...this]);
    // Create Map to perform the same operations on it as on the tree
    let map = new Map;
    let max = count*2;
    // Perform a series of insertions
    for (let i = 0; i < count; i++) {
        // Choose random key
        let key = Math.floor(Math.random() * max);
        let value = key*2;
        // Perform same insertion in array and tree
        map.set(key, value);
        this.set(key, value);
        // Verify tree consistency and properties
        this.verify();
        // Verify the order of key/values in the array is the same as in the tree
        console.assert(isEqual(), "tree not same as array");
    }
    // Perform a series of retrievals and updates
    for (let i = 0; i < count; i++) {
        // Choose random key
        let key = Math.floor(Math.random() * max);
        // Perform same retrieval in array and tree
        let value = map.get(key);
        if (value !== this.get(key)) throw "get() returns inconsistent result";
        if (value === undefined) { // value is not in tree
            this.remove(key); // should not alter the tree
        } else { // value is in tree: update it
            map.set(key, value+10);
            this.set(key, value+10);
        }
        // Verify tree consistency and properties
        this.verify();
        // Verify the order of key/values in the array is the same as in the tree
        console.assert(isEqual(), "tree not same as array");
    }
    // Perform a series of deletions
    for (let i = map.size; i > 0; i--) {
        // Choose random deletion value
        let j = Math.floor(Math.random() * i)
        let key = [...map.keys()][j];
        // Perform same deletion in array and tree
        map.delete(key);
        this.remove(key);
        // Verify tree consistency and properties
        this.verify();
        // Verify the order of key/values in the array is the same as in the tree
        console.assert(isEqual(), "tree not same as array");
    }
}

// Perform 1000 calls of set (some duplicates),
//    1000 calls of get and updating set calls,
//    and remove calls to remove all nodes,
//    on a tree with node capacity of 8
let tree = new Tree(8).test(1000);
console.log("all tests completed");