import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThemeContext } from '@/services/theme_context.jsx';
import { useTranslation } from 'react-i18next';
import { ChevronsUpDown, Upload, Calendar, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Static values (read-only)
  const academicYear = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0..11
    const startYear = m >= 8 ? y : y - 1;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  }, []);

  const coSupervisor = 'Eng/ Khalil';

  //  مثال بيانات طلاب - نبدّلها  بعدين ببيانات حقيقية
  const students = useMemo(
    () => [
      { id: '2021001', name: 'Ahmed Ali' },
      { id: '2021002', name: 'Mona Hassan' },
      { id: '2021003', name: 'Omar Samy' },
      { id: '2021004', name: 'Salma Adel' },
      { id: '2021005', name: 'Youssef Mahmoud' },
    ],
    []
  );

  const [formData, setFormData] = useState({
    projectTitleEn: '',
    projectDescription: '',
    completionDate: '',
    mainSupervisor: '',
    uploadedFile: null,

    //  البحث/الإدخال
    studentId: '',
    //  Multi-select list
    selectedStudents: [], // [{id,name}]
  });

  const [errors, setErrors] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  //  Dropdown state/refs
  const [isStudentPanelOpen, setIsStudentPanelOpen] = useState(false);
  const assignWrapRef = useRef(null);
  const studentInputRef = useRef(null);

  //  فلترة لستة الطلاب (بالـ ID أو الاسم)
  const filteredStudents = useMemo(() => {
    const q = (formData.studentId || '').trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        `${s.name} ${s.id}`.toLowerCase().includes(q)
    );
  }, [formData.studentId, students]);

  //  قفل البانل لما تدوس برا
  useEffect(() => {
    const onDown = (e) => {
      if (!assignWrapRef.current) return;
      if (!assignWrapRef.current.contains(e.target)) {
        setIsStudentPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  //  فتح البانل (اسموز) + فوكس
  const openStudentPanel = () => {
    setIsStudentPanelOpen(true);
    requestAnimationFrame(() => studentInputRef.current?.focus());
  };

  const toggleStudentPanel = () => {
    setIsStudentPanelOpen((prev) => !prev);
    requestAnimationFrame(() => studentInputRef.current?.focus());
  };

  //  إدخال/بحث
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, studentId: value }));
    if (errors.selectedStudents) setErrors((prev) => ({ ...prev, selectedStudents: false }));
    setIsStudentPanelOpen(true);
  };

  //  إضافة طالب (Multi)
  const addStudent = (student) => {
    setFormData((prev) => {
      const exists = prev.selectedStudents.some((x) => x.id === student.id);
      if (exists) return { ...prev, studentId: '' }; // لو مكرر: بس امسح البحث
      return {
        ...prev,
        studentId: '',
        selectedStudents: [...prev.selectedStudents, student],
      };
    });
    if (errors.selectedStudents) setErrors((prev) => ({ ...prev, selectedStudents: false }));
    requestAnimationFrame(() => studentInputRef.current?.focus());
  };

  //  جديد: إضافة طالب بمجرد كتابة ID كامل (Enter/Blur)
  const addStudentById = (id) => {
    const value = (id || '').trim();
    if (!value) return false;

    const found = students.find((s) => s.id === value);
    if (!found) return false;

    addStudent(found);
    return true;
  };

  //  حذف طالب
  const removeStudent = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.filter((s) => s.id !== id),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, uploadedFile: file }));
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, uploadedFile: files[0] }));
      toast.success(`File "${files[0].name}" uploaded successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    toast.info(t('Draft saved successfully!'), {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectTitleEn.trim()) newErrors.projectTitleEn = true;
    if (!formData.projectDescription.trim()) newErrors.projectDescription = true;
    if (!formData.completionDate.trim()) newErrors.completionDate = true;
    if (!formData.mainSupervisor) newErrors.mainSupervisor = true;

    // ✅ لازم طالب واحد على الأقل
    if (!formData.selectedStudents.length) newErrors.selectedStudents = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRegistration = () => {
    if (!validateForm()) {
      toast.error(t('Please fill in all required fields'), {
        position: 'top-right',
        autoClose: 4000,
      });
      return;
    }

    console.log('Registration submitted:', formData);
    toast.success(t('Project registered successfully!'), {
      position: 'top-right',
      autoClose: 3000,
    });

    setTimeout(() => {
      setFormData({
        projectTitleEn: '',
        projectDescription: '',
        completionDate: '',
        mainSupervisor: '',
        uploadedFile: null,
        studentId: '',
        selectedStudents: [],
      });
      setErrors({});
      setIsStudentPanelOpen(false);
    }, 1000);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={colors?.mode === 'dark' ? 'dark' : 'light'}
      />

      <div style={{ width: '100%', padding: '0 24px' }}>
        <div
          className="form-container"
          style={{
            width: '100%',
            minHeight: '929px',
            background: colors?.box || '#FFFFFF',
            borderRadius: '8px',
            padding: '32px',
            boxSizing: 'border-box',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <div style={{ paddingBottom: '16px', marginBottom: '32px' }}>
            <h2
              style={{
                color: colors?.text || '#020617',
                fontSize: '20px',
                fontWeight: '400',
                margin: 0,
                fontFamily: 'Inter, -apple-system, sans-serif',
                lineHeight: '100%',
              }}
            >
              {t('Register New Project')}
            </h2>
          </div>

          {/* Form Content */}
          <div style={{ padding: 0 }}>
            {/* Assign Students */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: colors?.text || '#374151',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginBottom: '16px',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  lineHeight: '14px',
                }}
              >
                {t('Assign Students')}
                <span style={{ color: '#DC2626' }}>*</span>
              </label>

              <div
                className="two-column-grid-assign"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 3fr',
                  gap: '40px',
                  alignItems: 'start',
                }}
              >
                {/*  Custom Combo (ID + Panel) */}
                <div ref={assignWrapRef} style={{ position: 'relative' }}>
                  <input
                    ref={studentInputRef}
                    name="studentId"
                    className="input-field"
                    value={formData.studentId}
                    onChange={handleStudentIdChange}
                    placeholder={t('Select by ID')}
                    onFocus={openStudentPanel}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const added = addStudentById(formData.studentId);
                        if (!added) setIsStudentPanelOpen(true);
                      }
                    }}
                    onBlur={() => {
                      //  لو كتب ID صحيح وخرج من الحقل
                      addStudentById(formData.studentId);
                    }}
                    style={{
                      width: '100%',
                      height: '60px',
                      padding: '0 16px',
                      border: `2px solid ${errors.selectedStudents ? '#DC2626' : '#D9D9D9'}`,
                      borderRadius: '8px',
                      background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                      color: colors?.text || '#000000',
                      fontSize: '16px',
                      fontWeight: '400',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                      outline: 'none',
                      paddingRight: isRTL ? '16px' : '40px',
                      paddingLeft: isRTL ? '40px' : '16px',
                      transition: 'all 0.2s ease',
                      lineHeight: '14px',
                    }}
                    onFocusCapture={(e) => {
                      if (!errors.selectedStudents) e.target.style.borderColor = '#71717A';
                    }}
                    onBlurCapture={(e) => {
                      if (!errors.selectedStudents) e.target.style.borderColor = '#D9D9D9';
                    }}
                  />

                  {/*  Icon clickable */}
                  <ChevronsUpDown
                    onClick={toggleStudentPanel}
                    style={{
                      position: 'absolute',
                      right: isRTL ? 'auto' : '16px',
                      left: isRTL ? '16px' : 'auto',
                      top: '30px',
                      transform: `translateY(-50%) rotate(${isStudentPanelOpen ? 180 : 0}deg)`,
                      cursor: 'pointer',
                      color: '#000000',
                      width: '15px',
                      height: '15px',
                      transition: 'transform 180ms ease',
                    }}
                  />

                  {/*  Smooth responsive panel */}
                  <div
                    className={`student-panel ${isStudentPanelOpen ? 'open' : ''}`}
                    style={{
                      position: 'absolute',
                      zIndex: 50,
                      left: 0,
                      right: 0,
                      marginTop: '8px',
                      borderRadius: '12px',
                      border: `1px solid ${colors?.mode === 'dark' ? '#4B5563' : '#E5E7EB'}`,
                      background: colors?.mode === 'dark' ? '#111827' : '#FFFFFF',
                      boxShadow: '0px 12px 30px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 10px 8px',
                        borderBottom: `1px solid ${colors?.mode === 'dark' ? '#374151' : '#F1F5F9'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: colors?.mode === 'dark' ? '#E5E7EB' : '#0F172A',
                          fontSize: '12px',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                        }}
                      >
                        {t('Choose a student')}
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsStudentPanelOpen(false)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '8px',
                        }}
                        aria-label="Close"
                      >
                        <X
                          size={16}
                          style={{ color: colors?.mode === 'dark' ? '#E5E7EB' : '#0F172A' }}
                        />
                      </button>
                    </div>

                    <div className="student-panel-list">
                      {filteredStudents.length === 0 ? (
                        <div
                          style={{
                            padding: '12px',
                            color: colors?.mode === 'dark' ? '#9CA3AF' : '#64748B',
                            fontSize: '13px',
                            fontFamily: 'Inter, -apple-system, sans-serif',
                          }}
                        >
                          {t('No results')}
                        </div>
                      ) : (
                        filteredStudents.map((s) => {
                          const selected = formData.selectedStudents.some((x) => x.id === s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => addStudent(s)}
                              className="student-item"
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                background: selected
                                  ? colors?.mode === 'dark'
                                    ? 'rgba(59,130,246,0.18)'
                                    : 'rgba(59,130,246,0.12)'
                                  : 'transparent',
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span
                                  style={{
                                    color: colors?.mode === 'dark' ? '#E5E7EB' : '#0F172A',
                                    fontSize: '14px',
                                    fontFamily: 'Inter, -apple-system, sans-serif',
                                    direction: isRTL ? 'rtl' : 'ltr',
                                  }}
                                >
                                  {s.name}
                                </span>
                                <span
                                  style={{
                                    color: colors?.mode === 'dark' ? '#9CA3AF' : '#64748B',
                                    fontSize: '12px',
                                    fontFamily: 'Inter, -apple-system, sans-serif',
                                  }}
                                >
                                  {s.id}
                                </span>
                              </div>

                              <span
                                style={{
                                  color: selected
                                    ? colors?.mode === 'dark'
                                      ? '#93C5FD'
                                      : '#2563EB'
                                    : colors?.mode === 'dark'
                                    ? '#9CA3AF'
                                    : '#94A3B8',
                                  fontSize: '12px',
                                  fontFamily: 'Inter, -apple-system, sans-serif',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {selected ? t('Selected') : t('Select')}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/*  Selected Students (chips) */}
                <div
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    border: `1px solid ${errors.selectedStudents ? '#DC2626' : '#D9D9D9'}`,
                    borderRadius: '8px',
                    background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                    padding: '10px 12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  {formData.selectedStudents.length === 0 ? (
                    <span
                      style={{
                        color: '#71717A',
                        fontSize: '16px',
                        fontWeight: 400,
                        fontFamily: 'Inter, -apple-system, sans-serif',
                      }}
                    >
                      {t('Selected Student')}
                    </span>
                  ) : (
                    formData.selectedStudents.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '999px',
                          border: `1px solid ${colors?.mode === 'dark' ? '#4B5563' : '#E2E8F0'}`,
                          background: colors?.mode === 'dark' ? '#111827' : '#F8FAFC',
                          color: colors?.mode === 'dark' ? '#E5E7EB' : '#0F172A',
                          fontSize: '13px',
                          fontFamily: 'Inter, -apple-system, sans-serif',
                        }}
                      >
                        {s.name} ({s.id})
                        <button
                          type="button"
                          onClick={() => removeStudent(s.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                          }}
                          aria-label="Remove student"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {errors.selectedStudents && (
                <p
                  style={{
                    color: '#DC2626',
                    fontSize: '12px',
                    marginTop: '6px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  {t('This field is required')}
                </p>
              )}
            </div>

            {/* Project Title (English) */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: colors?.text || '#374151',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginBottom: '16px',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  lineHeight: '14px',
                }}
              >
                {t('Project Title (English)')}
                <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                name="projectTitleEn"
                className="input-field"
                value={formData.projectTitleEn}
                onChange={handleInputChange}
                placeholder={t('Enter Project Title')}
                style={{
                  width: '100%',
                  height: '60px',
                  padding: '0 16px',
                  border: `2px solid ${errors.projectTitleEn ? '#DC2626' : '#D9D9D9'}`,
                  borderRadius: '8px',
                  background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                  color: colors?.text || '#000000',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  lineHeight: '14px',
                }}
                onFocus={(e) => {
                  if (!errors.projectTitleEn) e.target.style.borderColor = '#71717A';
                }}
                onBlur={(e) => {
                  if (!errors.projectTitleEn) e.target.style.borderColor = '#D9D9D9';
                }}
              />
              {errors.projectTitleEn && (
                <p
                  style={{
                    color: '#DC2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  {t('This field is required')}
                </p>
              )}
            </div>

            {/* Project Description */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: colors?.text || '#374151',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginBottom: '16px',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  lineHeight: '14px',
                }}
              >
                {t('Project Description')}
                <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                name="projectDescription"
                className="textarea-field"
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder={t('Write Project Description')}
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '12px 16px',
                  border: `2px solid ${errors.projectDescription ? '#DC2626' : '#D9D9D9'}`,
                  borderRadius: '8px',
                  background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                  color: colors?.text || '#000000',
                  fontSize: '16px',
                  fontWeight: '400',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  lineHeight: '14px',
                }}
                onFocus={(e) => {
                  if (!errors.projectDescription) e.target.style.borderColor = '#71717A';
                }}
                onBlur={(e) => {
                  if (!errors.projectDescription) e.target.style.borderColor = '#D9D9D9';
                }}
              />
              {errors.projectDescription && (
                <p
                  style={{
                    color: '#DC2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  {t('This field is required')}
                </p>
              )}
            </div>

            {/* Academic Year & Completion Date */}
            <div
              className="two-column-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '90px',
                marginBottom: '24px',
              }}
            >
              {/* Academic Year - DISABLED */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: colors?.text || '#374151',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: '16px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    lineHeight: '14px',
                  }}
                >
                  {t('Academic year')}
                </label>
                <input
                  type="text"
                  value={academicYear}
                  disabled
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '0 16px',
                    border: `1px solid ${colors?.mode === 'dark' ? '#374151' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    background: colors?.mode === 'dark' ? '#0F1419' : '#F3F4F6',
                    color: colors?.mode === 'dark' ? '#6B7280' : '#9CA3AF',
                    fontSize: '16px',
                    fontWeight: '400',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    outline: 'none',
                    cursor: 'not-allowed',
                    lineHeight: '14px',
                  }}
                />
              </div>

              {/* Completion Date */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: colors?.text || '#374151',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: '16px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    lineHeight: '14px',
                  }}
                >
                  {t('Completion Date')}
                  <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="completionDate"
                    className="input-field"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    placeholder={t('Pick Date')}
                    style={{
                      width: '100%',
                      height: '60px',
                      padding: '0 16px',
                      border: `2px solid ${errors.completionDate ? '#DC2626' : '#D9D9D9'}`,
                      borderRadius: '8px',
                      background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                      color: colors?.text || '#000000',
                      fontSize: '16px',
                      fontWeight: '400',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                      outline: 'none',
                      paddingRight: isRTL ? '16px' : '40px',
                      paddingLeft: isRTL ? '40px' : '16px',
                      transition: 'all 0.3s ease',
                      lineHeight: '14px',
                    }}
                    onFocus={(e) => {
                      if (!errors.completionDate) e.target.style.borderColor = '#71717A';
                    }}
                    onBlur={(e) => {
                      if (!errors.completionDate) e.target.style.borderColor = '#D9D9D9';
                    }}
                  />
                  <Calendar
                    style={{
                      position: 'absolute',
                      right: isRTL ? 'auto' : '16px',
                      left: isRTL ? '16px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#475569',
                      width: '18px',
                      height: '18px',
                    }}
                  />
                </div>
                {errors.completionDate && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                    {t('This field is required')}
                  </p>
                )}
              </div>
            </div>

            {/* Supervisors */}
            <div
              className="two-column-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '90px',
                marginBottom: '24px',
              }}
            >
              {/* Main Supervisor */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: colors?.text || '#374151',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: '16px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    lineHeight: '14px',
                  }}
                >
                  {t('Main Supervisor')}
                  <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="mainSupervisor"
                    className="input-field"
                    value={formData.mainSupervisor}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      height: '60px',
                      padding: '0 16px',
                      border: `2px solid ${errors.mainSupervisor ? '#DC2626' : '#D9D9D9'}`,
                      borderRadius: '8px',
                      background: colors?.mode === 'dark' ? '#374151' : '#FFFFFF',
                      color: colors?.mode === 'dark' ? '#71717A' : '#71717A',
                      fontSize: '16px',
                      fontWeight: '400',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      paddingRight: isRTL ? '16px' : '40px',
                      paddingLeft: isRTL ? '40px' : '16px',
                      transition: 'all 0.3s ease',
                      lineHeight: '14px',
                    }}
                  >
                    <option value="">{t('Select Your Main Supervisor')}</option>
                    <option value="Dr. Ahmed Ali">Dr. Ahmed Ali</option>
                    <option value="Dr. Manal Shaban">Dr. Manal Shaban</option>
                    <option value="Dr. Manel Ghalian">Dr. Manel Ghalian</option>
                  </select>
                  <ChevronsUpDown
                    style={{
                      position: 'absolute',
                      right: isRTL ? 'auto' : '16px',
                      left: isRTL ? '16px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#000000',
                      width: '15px',
                      height: '15px',
                    }}
                  />
                </div>
                {errors.mainSupervisor && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
                    {t('This field is required')}
                  </p>
                )}
              </div>

              {/* Co-Supervisor - DISABLED */}
              <div>
                <label
                  style={{
                    display: 'block',
                    color: colors?.text || '#374151',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: '16px',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    lineHeight: '14px',
                  }}
                >
                  {t('Co-Supervisor')}
                </label>
                <input
                  type="text"
                  value={coSupervisor}
                  disabled
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '0 16px',
                    border: `1px solid ${colors?.mode === 'dark' ? '#374151' : '#D1D5DB'}`,
                    borderRadius: '8px',
                    background: colors?.mode === 'dark' ? '#0F1419' : '#F3F4F6',
                    color: colors?.mode === 'dark' ? '#6B7280' : '#9CA3AF',
                    fontSize: '16px',
                    fontWeight: '400',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    outline: 'none',
                    cursor: 'not-allowed',
                    lineHeight: '14px',
                  }}
                />
              </div>
            </div>

            {/* Upload File */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  color: colors?.text || '#374151',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginBottom: '16px',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  lineHeight: '14px',
                }}
              >
                {t('Upload File')}
              </label>
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                  border: `2px dashed ${
                    isDragging || isHovering
                      ? '#1F609D'
                      : colors?.mode === 'dark'
                      ? '#4B5563'
                      : '#D1D5DB'
                  }`,
                  borderRadius: '8px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  background:
                    isDragging || isHovering
                      ? '#F9FAFB'
                      : colors?.mode === 'dark'
                      ? '#374151'
                      : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input id="fileInput" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                <div style={{ marginBottom: '12px' }}>
                  <Upload size={40} strokeWidth={1.2} style={{ margin: '0 auto', display: 'block', color: '#000000' }} />
                </div>
                <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
                  {t('Upload A file')}
                </p>
                <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
                  {t('Drag & drop your file here or click to upload*')}
                </p>
                {formData.uploadedFile && (
                  <p style={{ color: colors?.text, fontSize: '12px', marginTop: '8px' }}>
                    {t('Selected')}: {formData.uploadedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px' }}>
              <button
                onClick={handleSaveDraft}
                style={{
                  width: '130px',
                  height: '40px',
                  background: 'transparent',
                  border: `1px solid #D9D9D9`,
                  borderRadius: '8px',
                  color: colors?.text || '#000000',
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = colors?.mode === 'dark' ? '#374151' : '#F4F4F5')}
                onMouseLeave={(e) => (e.target.style.background = 'transparent')}
              >
                {t('Save Draft')}
              </button>

              <button
                onClick={handleSubmitRegistration}
                style={{
                  width: '180px',
                  height: '40px',
                  background: '#1F609D',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '400',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#1A4F7E')}
                onMouseLeave={(e) => (e.target.style.background = '#1F609D')}
              >
                {t('Submit Registration')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder,
        textarea::placeholder,
        select {
          color: #71717A !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          font-family: Inter, -apple-system, sans-serif !important;
          line-height: 14px !important;
        }

        .input-field { height: 60px; }
        .textarea-field { height: 150px; }

        /* ✅ Smooth panel animation */
        .student-panel {
          opacity: 0;
          transform: translateY(-6px) scale(0.98);
          pointer-events: none;
          transition: opacity 160ms ease, transform 180ms ease;
        }

        .student-panel.open {
          opacity: 1;
          transform: translateY(0px) scale(1);
          pointer-events: auto;
        }

        /* ✅ list scroll + responsive height */
        .student-panel-list {
          max-height: 280px;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* ✅ hover effect (light) */
        .student-item:hover {
          background: rgba(15, 23, 42, 0.06) !important;
        }

        @media (max-width: 1400px) {
          .input-field { height: 56px !important; }
          .textarea-field { height: 140px !important; }
          .student-panel-list { max-height: 260px; }
        }

        @media (max-width: 1116px) {
          .input-field { height: 52px !important; }
          .textarea-field { height: 130px !important; }
          .two-column-grid,
          .two-column-grid-assign { grid-template-columns: 1fr !important; }
          .button-container { flex-direction: column !important; }
          .button-container button { width: 100% !important; }
          .student-panel-list { max-height: 240px; }
        }

        @media (max-width: 768px) {
          .input-field { height: 48px !important; }
          .textarea-field { height: 120px !important; }
          .student-panel-list { max-height: 220px; }
        }

        @media (max-width: 480px) {
          .input-field { height: 44px !important; }
          .textarea-field { height: 110px !important; }
          .student-panel-list { max-height: 200px; }
        }
      `}</style>
    </>
  );
};

export default CreateProject;