import uuid from 'uuid/v1'

export default {
  data() {
    return {
      curNode: null
    }
  },

  computed: {
    curNodeData() {
      return this.curNode ? this.curNode.data : {}
    },

    curData() {
      return this.curNode ? this.curNode.data.data : {}
    },

    hasCurrent() {
      return this.curNode != null
    },

    hasNoCurrent() {
      return this.curNode == null
    },

    parentNode() {
      return this.hasCurrent ? this.curNode.parent : {}
    },

    parentData() {
      return this.parentNode ? this.parentNode.data.data : {}
    },

    rootNode() {
      return this.$tree.store.root
    }
  },

  methods: {
    createNodeData(data) {
      return {
        id: uuid(),
        label: data.name,
        data: data,
        children: []
      }
    },

    addSibling(data) {
      if (this.hasCurrent) {
        const parent = this.curNode.parent
        parent.insertChild({ data })
      }
    },

    addChild(data) {
      if (this.hasCurrent) {
        this.curNode.insertChild({ data })
        this.curNode.expanded = true
      }
    },

    setCurrentNode(data) {
      this.$tree.setCurrentNode(data)
      this.curNode = this.$tree.store.currentNode
    },

    removeNode(node) {
      if (node) {
        if (node.previousSibling) {
          this.setCurrentNode(node.previousSibling.data)
        } else {
          this.setCurrentNode(node.parent.data)
        }
        node.remove()
      }
    },

    appendNode(data, node) {
      node = node || this.$tree.store.root
      node.insertChild({ data })
    },

    locateNode(nodeKey) {
      const node = this.$tree.getNode(nodeKey)
      if (node) {
        node.expanded = true
        let parent = node.parent
        while (parent) {
          parent.expanded = true
          parent = parent.parent
        }
        this.setCurrentNode(node.data)
      }
    }
  }
}
