module.exports = {
    number_format: (product_amount) => {
        return parseFloat(product_amount)
    },
    stripTags: (product_description) => {
        return product_description.replace(/<(?:.|\n)*?>/gm, '')
    }
}