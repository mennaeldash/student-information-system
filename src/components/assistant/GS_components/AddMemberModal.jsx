import React, { useState, useEffect } from "react";
import { XCircle, ChevronsUpDown } from "lucide-react";
import { useThemeContext } from "@/services/theme_context.jsx";
import { useTranslation } from "react-i18next";

// قاعدة بيانات وهمية تربط الـ ID بالاسم واللون
const STUDENTS_DATABASE = {
  "200920": { name: "AA", fullName: "Ahmed Ali", color: "#2563EB" },
  "201845": { name: "SA", fullName: "Sara Ahmed", color: "#9C719A" },
  "202367": { name: "MH", fullName: "Mohamed Hassan", color: "#99B59E" },
  "203491": { name: "FK", fullName: "Fatima Khaled", color: "#485A83" },
  "204628": { name: "OY", fullName: "Omar Youssef", color: "#DC2626" },
};

const AddMemberModal = ({ open, onClose, project, onSave }) => {
  const { colors } = useThemeContext();
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState("");
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const isRTL = i18n.language === "ar";

  // Initialize displayed members when modal opens or project changes
  useEffect(() => {
    if (project?.members) {
      setDisplayedMembers([...project.members]);
    }
  }, [project?.members, open]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedId("");
    }
  }, [open]);

  if (!open) return null;

  const handleIdChange = (id) => {
    setSelectedId(id);
    if (id && STUDENTS_DATABASE[id]) {
      // إضافة العضو مباشرة عند اختيار الـ ID
      const newMember = {
        id: id,
        name: STUDENTS_DATABASE[id].name,
        color: STUDENTS_DATABASE[id].color,
        fullName: STUDENTS_DATABASE[id].fullName,
      };

      // تحقق إذا العضو موجود بالفعل
      const memberExists = displayedMembers.some((member) => member.id === id);

      if (!memberExists) {
        setDisplayedMembers([...displayedMembers, newMember]);
      } else {
        alert("This member already exists in the project");
      }

      // إعادة تعيين الاختيار
      setSelectedId("");
    }
  };

  const handleSave = () => {
    // حفظ التغييرات في المشروع
    if (onSave && project) {
      const updatedProject = {
        ...project,
        members: displayedMembers,
      };
      onSave(updatedProject);
    }
    onClose();
  };

  const handleRemoveMember = (index) => {
    // Remove member from displayed list
    setDisplayedMembers((prevMembers) =>
      prevMembers.filter((_, i) => i !== index)
    );
  };

  // دالة للحصول على الاسم الكامل للعرض
  const getDisplayName = (member, index) => {
    // لو العضو عنده fullName يظهره، لو لأ يستخدم الأسماء الثابتة القديمة
    if (member.fullName) {
      return member.fullName;
    }

    return index === 0
      ? "Mohamed"
      : index === 1
      ? "Ahmed"
      : index === 2
      ? "Elham"
      : "Mostafa";
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .modal-container {
          background: ${colors?.mode === "dark" ? "#1F2937" : "#FFFFFF"};
          border-radius: 8px;
          width: 655px;
          height: 484px;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
          padding: 15px 30px 30px 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .modal-title {
          font-size: 30px;
          font-weight: 500;
          color: ${colors?.text || "#020617"};
          margin: 0;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 32px;
          width: 241px;
          height: 64px;
          display: flex;
          align-items: center;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }

        .section-title {
          font-size: 20px;
          font-weight: 500;
          color: ${colors?.text || "#020617"};
          margin: 0;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 32px;
        }

        .recent-members-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 10px 0 15px 0;
          box-sizing: border-box;
          gap: 20px;
        }

        .members-content {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .members-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .member-badge {
          background: #DBEEFF;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 16px;
          font-weight: 400;
          color: #1F609D;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 24px;
          height: 40px;
          box-sizing: border-box;
        }

        .member-badge button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          color: #1F609D;
          line-height: 0;
        }

        .avatar-container {
          display: flex;
          gap: 0;
        }

        .avatar-circle {
          width: 46px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
          color: #FFFFFF;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 24px;
        }

        .avatar-circle:not(:first-child) {
          margin-left: -12px;
        }

        .add-member-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .select-wrapper {
          position: relative;
          width: 100%;
          height: 55px;
          padding: 0 30px 0 0;
        }

        .select-wrapper.rtl {
          padding: 0 0 0 30px;
        }

        .select-input {
          width: 100%;
          height: 55px;
          padding: 0 8px 0 16px;
          border: none;
          border-radius: 6px;
          background: ${colors?.mode === "dark" ? "#111827" : "#FFFFFF"};
          color: ${colors?.mode === "dark" ? "#9CA3AF" : "#35455C"};
          font-size: 18px;
          font-weight: 400;
          font-family: Inter, -apple-system, sans-serif;
          line-height: 28px;
          appearance: none;
          cursor: pointer;
          box-sizing: border-box;
          box-shadow: 0px 0px 4px 0px #00000040;
          display: flex;
          align-items: center;
        }

        .select-input.rtl {
          padding: 0 16px 0 8px;
        }

        .select-input:focus {
          outline: none;
          box-shadow: 0px 0px 4px 0px #00000040, 0 0 0 3px rgba(31, 96, 157, 0.1);
        }

        .select-input option {
          color: ${colors?.mode === "dark" ? "#FFFFFF" : "#020617"};
        }

        /* ✅ إخفاء المثلث/السهم الافتراضي اللي بيظهر مع input+datalist */
        .select-input::-webkit-calendar-picker-indicator {
          display: none !important;
        }
        .select-input::-webkit-list-button {
          display: none !important;
        }
        .select-input::-ms-expand {
          display: none;
        }
        .select-input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .select-arrow {
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: ${colors?.mode === "dark" ? "#9CA3AF" : "#35455C"};
          display: flex;
          align-items: center;
        }

        .select-arrow.rtl {
          right: auto;
          left: 40px;
        }

        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 22px;
          margin-top: auto;
        }

        .btn-cancel {
          min-width: 90px;
          height: 40px;
          background: transparent;
          border: 1px solid ${colors?.mode === "dark" ? "#4B5563" : "#71717A"};
          border-radius: 6px;
          color: ${colors?.mode === "dark" ? "#FFFFFF" : "#09090B"};
          font-size: 14px;
          font-weight: 400;
          font-family: Inter, -apple-system, sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 20px;
          box-sizing: border-box;
        }

        .btn-cancel:hover {
          background: ${colors?.mode === "dark" ? "#374151" : "#F4F4F5"};
        }

        .btn-save {
          min-width: 130px;
          height: 40px;
          background: #1F609D;
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 400;
          font-family: Inter, -apple-system, sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 20px;
          box-sizing: border-box;
        }

        .btn-save:hover {
          background: #1A5082;
        }

        @media (max-width: 767px) {
          .modal-container {
            width: calc(100% - 32px);
            height: auto;
            max-height: 90vh;
            overflow-y: auto;
            padding: 20px;
          }

          .modal-title {
            font-size: 24px;
            width: auto;
            height: auto;
          }

          .recent-members-container {
            width: 100%;
            height: auto;
            padding: 0;
          }

          .modal-content {
            gap: 16px;
          }

          .section-title {
            font-size: 18px;
          }

          .button-group {
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-save {
            width: 100%;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">{t("Add Members")}</h2>

          <div className="modal-content">
            {/* Recent Members Section */}
            <div className="recent-members-container">
              <h3 className="section-title">{t("Resent Member")}</h3>

              <div className="members-content">
                <div className="members-row">
                  {displayedMembers?.map((member, index) => (
                    <div key={member.id || index} className="member-badge">
                      <span>{getDisplayName(member, index)}</span>
                      <button onClick={() => handleRemoveMember(index)}>
                        <XCircle size={24} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="avatar-container">
                  {displayedMembers?.map((member, index) => (
                    <div
                      key={member.id || index}
                      className="avatar-circle"
                      style={{ background: member.color, zIndex: 10 - index }}
                    >
                      {member.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Member Section */}
            <div className="add-member-section">
              <h3 className="section-title">{t("Add Member")}</h3>

              <div className={`select-wrapper ${isRTL ? "rtl" : ""}`}>
                {/* ✅ نفس UI تمامًا: نفس wrapper + نفس class + نفس السهم */}
                <input
                  className={`select-input ${isRTL ? "rtl" : ""}`}
                  value={selectedId}
                  onChange={(e) => handleIdChange(e.target.value)}
                  placeholder={t("Select Id")}
                  list="students_ids_list"
                />

                <datalist id="students_ids_list">
                  <option value="200920">200920 - Ahmed Ali</option>
                  <option value="201845">201845 - Sara Ahmed</option>
                  <option value="202367">202367 - Mohamed Hassan</option>
                  <option value="203491">203491 - Fatima Khaled</option>
                  <option value="204628">204628 - Omar Youssef</option>
                </datalist>

                <div className={`select-arrow ${isRTL ? "rtl" : ""}`}>
                  <ChevronsUpDown size={20} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button className="btn-cancel" onClick={onClose}>
                {t("Cancel")}
              </button>
              <button className="btn-save" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;