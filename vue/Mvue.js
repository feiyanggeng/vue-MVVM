class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el)? options.el : document.querySelector(el);
        this.vm = vm;
        // 利用文档碎片将对应el的子元素全部放在缓存中，后续操作缓存中的dom，减少对页面上dom的操作次数，减少了页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        this.compile(fragment)
        this.el.appendChild(fragment)
    }
    compile(fragment) {}
    node2Fragment(node) {
        // 创建一个文档碎片
        let f = document.createDocumentFragment()
        let childNode;
        // 拿出所有的子节点放到f中；文档碎片的 appendChild 方法会把原来的元素 剥离出来放到自己里面，所以一旦使用的 appendChild 方法原来的元素里面对应的子元素就没有了
        while( childNode = node.firstChild) {
            f.appendChild(childNode)
        }
        return f
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
}


class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 创建一个解析器（编译模板）
            new Compile(this.$el, this)
        }
    }
}