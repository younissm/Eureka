import * as yup from "yup";

export const CreateProductSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required"),
  discount: yup.number().max(100).required("Discount is required"),
  stock: yup.number().required("Stock is required"),
  category: yup.string().required("Category is required"),
  thumbnail: yup.mixed().required("Thumbnail is required"),
});

export const EditProductSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required"),
  discount: yup.number().max(100).required("Discount is required"),
  stock: yup.number().required("Stock is required"),
  category: yup.string().required("Category is required"),
  thumbnail: yup.mixed().nullable(),
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("من فضلك ادخل بريد الكتروني صالح")
    .required("البريد الالكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب أن تحتوي على الأقل ٨ أحرف")
    .required("كلمة المرور مطلوبة"),
});

export const SignupSchema = yup.object().shape({
  firstName: yup.string().required("الاسم مطلوب"),
  lastName: yup.string().required("اللقب مطلوب"),
  email: yup
    .string()
    .email("من فضلك ادخل بريد الكتروني صالح")
    .required("البريد الالكتروني مطلوب"),
  password: yup
    .string()
    .min(8, "كلمة المرور يجب أن تحتوي على الأقل ٨ أحرف")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم على الاقل")
    .required("كلمة المرور مطلوبة"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("كلمة المرور الجديدة مطلوبة")
    .min(8, "كلمة المرور يجب أن تحتوي على الأقل ٨ أحرف")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم على الاقل"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

export const updatePasswordSchema = yup.object().shape({
  passwordCurrent: yup.string().required("كلمة المرور الحالية مطلوبة"),
  password: yup
    .string()
    .required("كلمة المرور الجديدة مطلوبة")
    .min(8, "كلمة المرور يجب أن تحتوي على الأقل ٨ أحرف")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم على الاقل"),
  passwordConfirm: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "يجب أن تتطابق كلمة المرور الجديدة وتأكيدها"
    )
    .required("تأكيد كلمة المرور الجديدة مطلوب"),
});
