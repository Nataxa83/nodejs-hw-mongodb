export const handleSaveError = (error, doc, next) => {

        error.status = 400;
        next();
};

export const setUpdateSet = function (next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
};
