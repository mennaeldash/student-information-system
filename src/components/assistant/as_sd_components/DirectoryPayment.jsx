import React, { useRef } from "react";
import { Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../services/theme_context.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TbFileTypePdf } from "react-icons/tb";
import { HiOutlinePrinter } from "react-icons/hi";
import { UserRound } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DirectoryPayment({ student }) {
  const { t, i18n } = useTranslation();
  const { theme: appTheme, colors } = useThemeContext();
  const isRTL = i18n.language === "ar";
  const isDark = colors?.mode === "dark" || appTheme === "dark";

  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(min-width:769px) and (max-width:1023px)");
  const isSmallLaptop = useMediaQuery("(min-width:1024px) and (max-width:1399px)");
  const isMediumScreen = useMediaQuery("(min-width:1400px) and (max-width:1649px)");
  const isResponsiveLaptop = useMediaQuery("(min-width:1650px)");

  const contentRef = useRef();

  // بيانات الطالب - هتيجي من الـ API
  const studentData = {
    name: student?.fullName || student?.name || "—",
    code: student?.studentId || "—",
    level: student?.level || "—",
    program: student?.program || "—",
    enrollmentStatus: student?.enrollmentStatus || t("New Enrollment") || "New Enrollment",
    yearOfEnrollment: student?.enrollmentDate || "2022 / 2023",
    university: student?.university || "(Fayoum University)",
    status: student?.status || t("Active") || "Active",
  };

  // بيانات وهمية للـ payments (هتتشال لما الـ API يجي)
  const dummyPayments = [
    {
      date: "15 / 3 / 2022",
      description: t("Course Hour Fees") || "Course Hour Fees",
      amount: "11,934",
      currency: "EGP",
      notes: "—",
      receiptNumber: "—",
      status: t("Paid") || "Paid",
    },
    {
      date: "15 / 3 / 2022",
      description: t("Admission File Fee") || "Admission File Fee",
      amount: "1,000",
      currency: "EGP",
      notes: "—",
      receiptNumber: "—",
      status: t("Paid") || "Paid",
    },
    {
      date: "15 / 3 / 2022",
      description: t("E-Learning Content Fee") || "E-Learning Content Fee",
      amount: "1,750",
      currency: "EGP",
      notes: "—",
      receiptNumber: "—",
      status: t("Paid") || "Paid",
    },
    {
      date: "15 / 3 / 2022",
      description: t("Administrative, Technology & Health Insurance Fees") || "Administrative, Technology & Health Insurance Fees",
      amount: "3,500",
      currency: "EGP",
      notes: "—",
      receiptNumber: "—",
      status: t("Paid") || "Paid",
    },
    {
      date: "27 / 9 / 2022",
      description: t("Payment") || "Payment",
      amount: "18,183",
      currency: "EGP",
      notes: "Bank Misr",
      receiptNumber: "101248",
      status: t("Paid") || "Paid",
    },
  ];

  // الفصول الدراسية - هتيجي من الـ API أو تستخدم الوهمية
  const semesters = student?.semesters || [
    {
      name: t("Semester 1") + "  2022-2032" || "Semester 1 _ 2022-2032",
      payments: dummyPayments,
    },
    {
      name: t("Semester 2") + "  2022-2032" || "Semester 2 _ 2022-2032",
      payments: dummyPayments,
    },
  ];

  const pageBg = colors?.background || (isDark ? "#020617" : "#F3F4F6");
  const cardBg = colors?.box || (isDark ? "#0B1220" : "#FFFFFF");
  const borderColor = colors?.border || (isDark ? "#1E293B" : "#E5E7EB");
  const textColor = colors?.text || (isDark ? "#E2E8F0" : "#111827");
  const secondaryTextColor = isDark ? "#94A3B8" : "#64748B";
  const tableBg = isDark ? "#0F172A" : "#F9FAFB";
  const tableHeaderBg = isDark ? "#1E293B" : "#F1F5F9";
  const tableRowHoverBg = isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9";

  const handleDownloadPDF = async () => {
    try {
      const element = contentRef.current;
      if (!element) return;

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDark ? "#020617" : "#F3F4F6",
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${studentData.name}_Payment_Statement.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("حدث خطأ أثناء إنشاء الـ PDF");
    }
  };

  const handlePrint = () => {
    try {
      const element = contentRef.current;
      if (!element) {
        alert("لم يتم العثور على المحتوى للطباعة");
        return;
      }

      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert("الرجاء السماح بالنوافذ المنبثقة للطباعة");
        return;
      }

      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      const printContent = `
        <!DOCTYPE html>
        <html dir="${isRTL ? 'rtl' : 'ltr'}">
          <head>
            <meta charset="utf-8">
            <title>${studentData.name} - ${t("Payment Statement") || "Payment Statement"}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
              ${styles}
              
              @page {
                size: A4;
                margin: 15mm;
              }
              
              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                body {
                  margin: 0;
                  padding: 20px;
                  background: white !important;
                  font-family: 'Inter', -apple-system, sans-serif !important;
                }
                
                .print-hide {
                  display: none !important;
                }
                
                table {
                  width: 100% !important;
                  page-break-inside: auto !important;
                }
                
                tr {
                  page-break-inside: avoid !important;
                  page-break-after: auto !important;
                }
                
                * {
                  overflow: visible !important;
                }
                
                .status-pill-print {
                  border: 2px solid #21A753 !important;
                  color: #21A753 !important;
                  background-color: #ECFDF4 !important;
                  font-weight: 600 !important;
                }
              }
              
              body {
                font-family: 'Inter', -apple-system, sans-serif;
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 500);
        }, 250);
      };

    } catch (error) {
      console.error("Print error:", error);
      alert("حدث خطأ أثناء الطباعة: " + error.message);
    }
  };

  return (
    <Box
      ref={contentRef}
      sx={{
        width: "100%",
        bgcolor: pageBg,
        direction: isRTL ? "rtl" : "ltr",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          bgcolor: cardBg,
          borderRadius: isMobile ? "8px" : "12px",
          border: `1px solid ${borderColor}`,
          p: isMobile ? "16px" : isTablet ? "20px" : "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "12px" : "20px",
            mb: isMobile ? "12px" : "16px",
            pb: isMobile ? "12px" : "16px",
            borderBottom: `2px solid ${borderColor}`,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "50px" : isTablet ? "58px" : "65px",
              height: isMobile ? "50px" : isTablet ? "58px" : "65px",
              minWidth: isMobile ? "50px" : isTablet ? "58px" : "65px",
              minHeight: isMobile ? "50px" : isTablet ? "58px" : "65px",
              borderRadius: "50px",
              border: `1px solid ${isDark ? "#64748B" : "#475569"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark ? "#1E293B" : "#FFFFFF",
              flexShrink: 0,
              boxSizing: "border-box",
              p: isMobile ? "5px 8px" : "7px 10px",
            }}
          >
            <UserRound 
              size={isMobile ? 24 : isTablet ? 28 : 32} 
              strokeWidth={1} 
              color={isDark ? "#94A3B8" : "#475569"}
            />
          </Box>

          <Box sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center", 
            gap: isMobile ? "8px" : isTablet ? "30px" : "50px" 
          }}>
            <Typography
              sx={{
                fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
                fontWeight: 400,
                color: textColor,
                fontFamily: "Inter, -apple-system, sans-serif",
                lineHeight: isMobile ? "24px" : "32px",
              }}
            >
              {studentData.name}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: isMobile ? "70px" : "90px",
                height: isMobile ? "24px" : "28px",
                px: isMobile ? "8px" : "10px",
                borderRadius: isMobile ? "6px" : "8px",
                bgcolor: isDark ? "rgba(34,197,94,0.16)" : "#DCFCE7",
                color: isDark ? "#86EFAC" : "#166534",
                border: `0.1px solid ${isDark ? "rgba(34,197,94,0.5)" : "#166534"}`,
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 400,
                fontFamily: "Inter, -apple-system, sans-serif",
                flexShrink: 0,
              }}
            >
              {studentData.status}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            columnGap: isMobile ? "16px" : isTablet ? "24px" : "36px",
            rowGap: isMobile ? "16px" : isTablet ? "20px" : "25px",
            px: isMobile ? "8px" : isTablet ? "20px" : isSmallLaptop ? "40px" : "80px",
            pt: isMobile ? "4px" : "8px",
            pb: isMobile ? "0px" : "4px",
          }}
        >
          <InfoField label={t("Code") + ":" || "Code:"} value={studentData.code} isDark={isDark} isMobile={isMobile} isTablet={isTablet} secondaryTextColor={secondaryTextColor} textColor={textColor} />
          <InfoField label={t("Program") + ":" || "Program:"} value={studentData.program} isDark={isDark} isMobile={isMobile} isTablet={isTablet} secondaryTextColor={secondaryTextColor} textColor={textColor} />
          <InfoField label={t("Year of Enrollment") + ":" || "Year of Enrollment:"} value={studentData.yearOfEnrollment} isDark={isDark} isMobile={isMobile} isTablet={isTablet} secondaryTextColor={secondaryTextColor} textColor={textColor} />
          <InfoField label={t("Level") + ":" || "Level:"} value={studentData.level} isDark={isDark} isMobile={isMobile} isTablet={isTablet} secondaryTextColor={secondaryTextColor} textColor={textColor} />
          <InfoField label={t("Enrollment Status") + ":" || "Enrollment Status:"} value={studentData.enrollmentStatus} isDark={isDark} isMobile={isMobile} isTablet={isTablet} secondaryTextColor={secondaryTextColor} textColor={textColor} />
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Typography
              sx={{
                fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
                fontWeight: 400,
                color: textColor,
                fontFamily: "Inter, -apple-system, sans-serif",
                lineHeight: isMobile ? "18px" : "20px",
              }}
            >
              {studentData.university}
            </Typography>
          </Box>
        </Box>
      </Card>

      {semesters.map((semester, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            bgcolor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: isMobile ? "8px" : "12px",
            p: isMobile ? "16px" : isTablet ? "20px" : { xs: 2, sm: 3 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: isMobile ? "18px" : isTablet ? "20px" : "22px",
              fontWeight: 500,
              lineHeight: isMobile ? "22px" : "24px",
              color: textColor,
              mb: 3,
            }}
          >
            {semester.name}
          </Typography>

          <Box
            sx={{
              bgcolor: tableBg,
              borderRadius: isMobile ? "6px" : "10px",
              border: `1px solid ${borderColor}`,
              boxShadow: isDark ? "0px 0px 8px 0px rgba(0, 0, 0, 0.5)" : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              WebkitOverflowScrolling: "touch",
              overflow: isResponsiveLaptop || isMediumScreen ? "hidden" : "auto",
            }}
          >
            <Table
              sx={{
                width: "100%",
                minWidth: isResponsiveLaptop || isMediumScreen ? "auto" : "1200px",
                tableLayout: isResponsiveLaptop || isMediumScreen ? "auto" : "auto",
                bgcolor: tableBg,
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: tableHeaderBg,
                    height: isMobile ? "56px" : isTablet ? "62px" : "68px",
                    boxShadow: isDark ? "0px 0px 8px 0px rgba(0, 0, 0, 0.5)" : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1 : 2,
                      minWidth: isMobile ? "80px" : "100px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("Date") || "Date"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1.5 : 3,
                      minWidth: isMobile ? "150px" : "200px",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {t("Payment Description") || "Payment Description"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1.5 : 3,
                      minWidth: isMobile ? "80px" : "100px",
                      textAlign: "center",
                    }}
                  >
                    {t("Amount") || "Amount"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1 : 2,
                      minWidth: isMobile ? "70px" : "90px",
                      textAlign: "center",
                    }}
                  >
                    {t("Currency") || "Currency"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1 : 2,
                      minWidth: isMobile ? "80px" : "100px",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {t("Notes") || "Notes"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1 : 2,
                      minWidth: isMobile ? "100px" : "130px",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {t("Receipt Number") || "Receipt Number"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Inter",
                      fontSize: isMobile ? "12px" : isTablet ? "14px" : isSmallLaptop ? "16px" : "18px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: textColor,
                      borderBottom: `1px solid ${borderColor}`,
                      py: 0,
                      px: isMobile ? 1 : 2,
                      minWidth: isMobile ? "70px" : "90px",
                      textAlign: "center",
                    }}
                  >
                    {t("Status") || "Status"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {semester.payments.map((payment, pIdx) => (
                  <TableRow
                    key={pIdx}
                    sx={{
                      height: "auto",
                      bgcolor: tableBg,
                      boxShadow: isDark ? "0px 0px 8px 0px rgba(0, 0, 0, 0.5)" : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      "&:hover": {
                        bgcolor: tableRowHoverBg,
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "13px" : isTablet ? "15px" : isSmallLaptop ? "17px" : "18px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: textColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1 : 2,
                        minWidth: isMobile ? "80px" : "100px",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      {payment.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "14px" : isTablet ? "16px" : isSmallLaptop ? "18px" : "20px",
                        fontWeight: 500,
                        lineHeight: "1.3",
                        color: secondaryTextColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1.5 : 3,
                        minWidth: isMobile ? "150px" : "200px",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        maxWidth: "300px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      {payment.description}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "14px" : isTablet ? "16px" : isSmallLaptop ? "18px" : "20px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: textColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1.5 : 3,
                        minWidth: isMobile ? "80px" : "100px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      {payment.amount}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "14px" : isTablet ? "16px" : isSmallLaptop ? "18px" : "20px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: textColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1 : 2,
                        minWidth: isMobile ? "70px" : "90px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      {payment.currency}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "14px" : isTablet ? "16px" : isSmallLaptop ? "18px" : "20px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: textColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1 : 2,
                        minWidth: isMobile ? "80px" : "100px",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      {payment.notes}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter",
                        fontSize: isMobile ? "14px" : isTablet ? "16px" : isSmallLaptop ? "18px" : "20px",
                        fontWeight: 500,
                        lineHeight: "24px",
                        color: textColor,
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1 : 2,
                        minWidth: isMobile ? "100px" : "130px",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      {payment.receiptNumber}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${borderColor}`,
                        py: isMobile ? "12px" : "16px",
                        px: isMobile ? 1 : 2,
                        minWidth: isMobile ? "70px" : "90px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      <StatusPill status={payment.status} isMobile={isMobile} isTablet={isTablet} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      ))}

      <Box className="print-hide" sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "flex-end", gap: isMobile ? "16px" : "31px", mt: 2 }}>
        <ActionButton icon={<TbFileTypePdf size={isMobile ? 20 : 24} color="#3B82F6" />} label={t("Download PDF") || "Download PDF"} width={isMobile ? "100%" : "161px"} isDark={isDark} isMobile={isMobile} onClick={handleDownloadPDF} />
        <ActionButton icon={<HiOutlinePrinter size={isMobile ? 20 : 24} color="#3B82F6" />} label={t("Print") || "Print"} width={isMobile ? "100%" : "131px"} isDark={isDark} isMobile={isMobile} onClick={handlePrint} />
      </Box>
    </Box>
  );
}

function InfoField({ label, value, isDark, isMobile, isTablet, secondaryTextColor, textColor }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: isMobile ? "13px" : isTablet ? "14px" : "16px",
          fontWeight: 400,
          color: secondaryTextColor,
          fontFamily: "Inter, -apple-system, sans-serif",
          lineHeight: isMobile ? "14px" : "16px",
          mb: isMobile ? "4px" : "6px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
          fontWeight: 400,
          color: textColor,
          fontFamily: "Inter, -apple-system, sans-serif",
          lineHeight: isMobile ? "18px" : "20px",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StatusPill({ status, isMobile, isTablet }) {
  return (
    <span
      className="status-pill-print"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? "60px" : isTablet ? "64px" : "68px",
        height: isMobile ? "32px" : "40px",
        padding: isMobile ? "6px" : "10px",
        borderRadius: isMobile ? "12px" : "16px",
        backgroundColor: "#ECFDF4",
        opacity: 1,
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: isMobile ? "11px" : isTablet ? "12px" : "14px",
        lineHeight: "20px",
        textAlign: "center",
        color: "#21A753",
      }}
    >
      {status}
    </span>
  );
}

function ActionButton({ icon, label, width, isDark, isMobile, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: width,
        height: isMobile ? "38px" : "40px",
        border: "1px solid #3B82F6",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
        bgcolor: "transparent",
        px: "12px",
        "&:hover": {
          bgcolor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
        },
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: isMobile ? "13px" : "14px",
          fontWeight: 500,
          color: "#3B82F6",
          fontFamily: "Inter, -apple-system, sans-serif",
          lineHeight: "20px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}