import Joi from 'joi';
//use package joi-objectid to validate mongodb objectIds

const create = Joi.object({
    title: Joi.string().required().messages({
        'any.string': 'لظفا عنوان را به صورت متن وارد کنید',
        'any.required': 'لظفا عنوان را وارد کنید',
    }),
    body: Joi.string().required().messages({
        'any.string': 'لظفا بدنه را به صورت متن وارد کنید',
        'any.required': 'لظفا بدنه را وارد کنید',
    }),
});

const update = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

export default { create, update };
