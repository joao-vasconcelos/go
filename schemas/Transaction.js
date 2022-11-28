/* * * * * */
/* SCHEMA: TRANSACTION */
/* * */

// timestamp [X]
// items [X]
// device [X]
// location [X]
// layout [X]
// user [X]
// customer [X]
// payment [X]
// invoice [X]
// discounts [X]

/* * */
/* IMPORTS */
import * as yup from 'yup';

/* * */
/* Schema for YUP ["Transaction"] Object */
export default yup.object({
  //
  // GENERAL
  timestamp: yup.string().max(30, 'Timestamp must not be longer than ${max} characters.'),

  // DEVICE
  // In which device was this transaction closed.
  device: yup.object({
    _id: yup.string().max(30, 'Device ID must not be longer than ${max} characters.'),
    title: yup.string().max(30, 'Device Title must not be longer than ${max} characters.'),
  }),

  // LOCATION
  // Which location is this transaction associated with.
  location: yup.object({
    _id: yup.string().max(30, 'Location ID must not be longer than ${max} characters.'),
    title: yup.string().max(30, 'Location Title must not be longer than ${max} characters.'),
  }),

  // USER
  // Which user closed this transaction.
  user: yup.object({
    _id: yup.string().max(30, 'Layout ID must not be longer than ${max} characters.'),
    name: yup.string().max(30, 'User Name must not be longer than ${max} characters.'),
    role: yup.string().max(30, 'User Role must not be longer than ${max} characters.'),
  }),

  // LAYOUT
  // What was the layout used at the moment.
  layout: yup.object({
    _id: yup.string().max(30, 'Layout ID must not be longer than ${max} characters.'),
    title: yup.string().max(30, 'Layout Title must not be longer than ${max} characters.'),
  }),

  // ITEMS
  // The list of products transacted.
  items: yup.array(
    yup.object({
      product_id: yup.string().max(30, 'Product ID must not be longer than ${max} characters.'),
      product_image: yup.string().max(30, 'Product Image must not be longer than ${max} characters.'),
      product_title: yup.string().max(30, 'Product Title must not be longer than ${max} characters.'),
      variation_id: yup.string().max(30, 'Variation ID must not be longer than ${max} characters.'),
      variation_title: yup.string().max(30, 'Variation Title must not be longer than ${max} characters.'),
      qty: yup.number().positive('Quantity must be positive.'),
      price: yup.number().min(0, 'Price must be greater than or equal to ${min}.'),
      tax_id: yup.string().max(3, 'Tax ID must not be longer than ${max} characters.'),
      tax_percentage: yup
        .number()
        .min(0, 'Tax Percentage must be greater than or equal to ${min}.')
        .max(1, 'Tax Percentage cannot be greater than ${max}.'),
      line_base: yup.number().min(0, 'Line Amount must be greater than or equal to ${min}.'),
      line_tax: yup.number().min(0, 'Line Tax must be greater than or equal to ${min}.'),
      line_total: yup.number().min(0, 'Line Total must be greater than or equal to ${min}.'),
    })
  ),

  // DISCOUNTS
  // The discounts applied in this transaction.
  discounts: yup.array(
    yup.object({
      _id: yup.string().max(30, 'Discount ID must not be longer than ${max} characters.'),
      title: yup.string().max(30, 'Discount Title must not be longer than ${max} characters.'),
      subtitle: yup.string().max(30, 'Discount Subtitle must not be longer than ${max} characters.'),
      description: yup.string().max(250, 'Discount Description must not be longer than ${max} characters.'),
      amount: yup.number().min(0, 'Discount Amount must be greater than or equal to ${min}.'),
    })
  ),

  // CUSTOMER (Optional)
  // The customer associated with this transaction.
  customer: yup.object({
    _id: yup.string().max(30, 'Customer ID must not be longer than ${max} characters.'),
    first_name: yup.string().max(30, 'First Name must not be longer than ${max} characters.'),
    last_name: yup.string().max(30, 'Last Name must not be longer than ${max} characters.'),
    reference: yup.string().max(30, 'Reference must not be longer than ${max} characters.'),
  }),

  // PAYMENT
  // How was this transaction paid, the amounts involved
  // and the associated tax details.
  payment: yup.object({
    is_paid: yup.boolean().required('"is_paid" is a required property.'),
    method_value: yup.string().max(30, 'Payment Method Value must not be longer than ${max} characters.'),
    method_label: yup.string().max(30, 'Payment Method Label must not be longer than ${max} characters.'),
    amount_subtotal: yup.number().min(0, 'Subtotal Amount must be greater than or equal to ${min}.'),
    amount_discounts: yup.number().min(0, 'Tax Amount must be greater than or equal to ${min}.'),
    amount_total: yup.number().min(0, 'Total Amount must be greater than or equal to ${min}.'),
    tax_region: yup
      .string()
      .matches(/^$|^[a-zA-Z]{2}$/, 'Tax Region must be exactly 2 letters (ex: PT, NL).')
      .uppercase(),
    tax_number: yup
      .string()
      .matches(/^$|^[0-9]{9}$/, 'Tax Number must be exactly 9 numbers (ex: 125 321 978).')
      .transform((value) => value.replace(/\s+/g, '.')),
  }),

  // CHECKING ACCOUNT (Optional)
  // The checking account associated with this transaction.
  // In this mode, it is frequent the transaction is unpaid
  checking_account: yup.object({
    _id: yup.string().max(30, 'Checking Account ID must not be longer than ${max} characters.'),
    title: yup.string().max(30, 'Checking Account Title must not be longer than ${max} characters.'),
    client_name: yup.string().max(30, 'Checking Account Client Name must not be longer than ${max} characters.'),
  }),

  // INVOICE (Optional)
  // The invoice details generated by Vendus.
  // This is optional because transactions paid by checking_account
  // are not invoiced immediately but monthly, usually.
  invoice: yup.object({
    invoice_id: yup.string().max(30, 'Invoice ID must not be longer than ${max} characters.'),
    type: yup.string().max(30, 'Invoice Type must not be longer than ${max} characters.'),
    number: yup.string().max(30, 'Invoice Number must not be longer than ${max} characters.'),
    date: yup.string().max(30, 'Invoice Date must not be longer than ${max} characters.'),
    system_time: yup.string().max(30, 'Invoice System Time must not be longer than ${max} characters.'),
    local_time: yup.string().max(30, 'Invoice Local Time must not be longer than ${max} characters.'),
    amount_gross: yup.string().max(30, 'Invoice Amount Gross must not be longer than ${max} characters.'),
    amount_net: yup.string().max(30, 'Invoice Amount Net must not be longer than ${max} characters.'),
    hash: yup.string().max(30, 'Invoice Hash must not be longer than ${max} characters.'),
    contact_email: yup.string().email(),
    send_invoice: yup.boolean().default(false),
  }),

  //
});
