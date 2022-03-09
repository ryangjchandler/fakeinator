import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

console.log(faker)

document.addEventListener('alpine:init', () => {
    Alpine.data('fakeinator', () => ({
        name: '',
        type: '',
        columns: [],
        rows: 10,
        optgroups: {},
        locales: Object.keys(faker.locales),
        locale: 'en_GB',
        init() {
            this.optgroups = Object.keys(faker)
                .filter(g => !['definitions', 'fake', 'unique'].includes(g))
                .reduce((groups, group) => {
                    groups[group] = Object.keys(faker[group]).filter(key => ! ['faker', 'Helpers'].includes(key))
                    return groups
                }, {})
        },
        add() {
            this.columns.push({ group: this.type.split('|')[0], name: this.name, type: this.type.split('|')[1] })
            
            this.name = ''
            this.type = ''
        },
        remove(i) {
            this.columns = this.columns.filter((_, j) => j !== i)
        },
        generate() {
            if (this.columns.length <= 0) {
                window.alert('Please add some columns first.')
                return
            }

            faker.setLocale(this.locale)

            const rows = [
                [...this.columns.map(c => c.name)],
            ]

            try {
                for (let i = 0; i < this.rows; i++) {
                    let row = []
    
                    for (let j = 0; j < this.columns.length; j++) {
                        const col = this.columns[j]

                        const fn = faker[col.group][col.type]
                        row.push(fn.call())
                    }
    
                    rows.push(row)
                }
            } catch (e) {
                window.alert('Oh dear, something went wrong! Check the console and let me know on GitHub :^)')

                throw e;
            }

            const csvContent = encodeURI('data:text/csv;charset=utf8,' + rows.map(row => row.join(',')).join('\n'))
            
            // Hacky downloads...
            const a = document.createElement('a')
            a.setAttribute('href', csvContent)
            a.setAttribute('download', 'faker.csv')
            document.body.appendChild(a)
            a.click()
        }
    }))
})