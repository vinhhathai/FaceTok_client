import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý form và validation
 * @param {Object} initialValues - Giá trị khởi tạo của form
 * @param {Function} validate - Hàm kiểm tra lỗi (trả về object errors)
 * @param {Function} onSubmit - Hàm xử lý khi form được submit và không có lỗi
 * @returns {Object} - Các giá trị và hàm để thao tác với form
 */
const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation khi giá trị thay đổi
  useEffect(() => {
    if (Object.keys(touched).length > 0 && validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, touched, validate]);

  // Kiểm tra nếu đang submit và không có lỗi thì gọi onSubmit
  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0 && onSubmit) {
      onSubmit(values);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, onSubmit, values]);

  // Xử lý thay đổi giá trị của input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Đánh dấu field đã được touch (người dùng đã tương tác)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Đánh dấu tất cả các field là đã touch
    const touchedFields = {};
    Object.keys(values).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);
    
    // Validate lại toàn bộ form
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
    
    setIsSubmitting(true);
  };

  // Reset form về giá trị ban đầu
  const resetForm = () => {
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Cập nhật giá trị form theo object
  const setFormValues = (newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useForm; 