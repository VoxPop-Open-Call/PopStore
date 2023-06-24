function textToPriceParser(text) {
    if(typeof text !== "string") return true

    // Remove everything except digits, periods, and commas
    let price = text.replace(/[^\d.,]/g, '');

    if (!text || text === '') {
        return 0;
    }

    if (/^\d+$/.test(price)) {
        return parseFloat(price);
    }
    
    if (/^\d*\.\d+$/.test(price)) {
        return parseFloat(price);
    }
    
    if ((/[,]+/.test(price) && /[.]+/.test(price)) && price.indexOf(',') < price.indexOf('.')) {
        price = price.replace(/[,]/g, '');
        return parseFloat(price);
    }
    
    if ((/[.]+/.test(price) && /[,]+/.test(price)) && price.indexOf('.') < price.indexOf(',')) {
        price = price.replace(/[.]/g, '').replace(/[,]/g, '.');
        return parseFloat(price);
    }
    
    if (/[.]{2,}/.test(price)) {
        price = price.replace(/[.]/g, '');
        return parseFloat(price);
    }

    if (/[,]{2,}/.test(price)) {
        price = price.replace(/[,]/g, '');
        return parseFloat(price);
    }

    if (/,\d{3}$/.test(price)) {
        price = price.replace(/[,]/g, '');
        return parseFloat(price);
    }
    
    if (/,[^,]{0,2}$/.test(price)) {
        price = price.replace(/[,]/g, '.');
        return parseFloat(price);
    }

    return false;
}

export default textToPriceParser