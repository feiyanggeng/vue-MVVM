const CompileUtil = {
    getValue(key, vm) {
        return key.split('.').reduce((pre, next) => pre[next], vm.$data);
    },
    text: function(el, key, vm) {
        let value;
        if (key.indexOf('{{') !== -1) {
            value = key.replace(/\{\{(.+?)\}\}/g, (...arg) => {
                return this.getValue(arg[1], vm)
            })
        } else {
            value = this.getValue(key, vm)
        }
       
        this.updater.updateText(el, value)
    },
    html: function (el, key, vm) {
        const value = this.getValue(key, vm)
        this.updater.updaterHtml(el, value)
    },
    model: function (el, key, vm) {
        const value = this.getValue(key, vm)
        this.updater.updateModel(el, value)
    },
    updater: {
        updateText(node, value) {
            node.textContent = value
        },
        updateModel(node, value) {
            node.value = value
        },  
        updaterHtml(node, value) {
            node.innerHTML = value
        },
    }
}

class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el)? options.el : document.querySelector(el);
        this.vm = vm;
        // 利用文档碎片将对应el的子元素全部放在缓存中，后续操作缓存中的dom，减少对页面上dom的操作次数，减少了页面的回流和重绘
        const fragment = this.node2Fragment(this.el);
        this.compile(fragment)
        this.el.appendChild(fragment)
    }
    compile(fragment) {
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                this.compileElement(child)
            } else {
                this.compileText(child)
            }
            if (child.childNodes && child.childNodes.length) {
                this.compile(child)
            }
        })
    }
    compileElement(node) {
        const attributes = node.attributes;
        [...attributes].forEach(attr => {
            const {name, value} = attr
            if (this.isDrective(name)) {
                const [, drective] = name.split('-');
                const [dirName, eventName] = drective.split(':')
                CompileUtil[dirName](node, value, this.vm)
                // 编译完成之后删除 vue指令
                node.removeAttribute('v-' + drective)
            }
        })
    }
    compileText(node) {
        const content = node.textContent
        if (/\{\{(.+?)\}\}/.test(content)) {
            CompileUtil.text(node, content, this.vm)
        }
    }
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
    isDrective(attrName) {
        return attrName.startsWith('v-')
    }
}

class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 创建订阅器
            new Observer(this.$data)
            // 创建一个解析器（编译模板）
            new Compile(this.$el, this)
        }
    }
}