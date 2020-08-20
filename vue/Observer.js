class Observer {
    constructor(data) {
        this.observe(data)
    }
    observe(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })
        }
    }
    defineReactive(obj, key, value) {
        this.observe(value);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get() {
                return value
            },
            set: (newVal)=> {
                this.observe(newVal)
                if (newVal !== value) {
                    value = newVal
                }
            }
        })
    }
}