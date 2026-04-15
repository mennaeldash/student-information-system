import { useEffect, useState } from "react";
import api from "../services/api";

export default function UseProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
const [contact, setContact] = useState(null);
  const [family, setFamily] = useState(null);
    const [q, setQ] = useState(null);
      const [transferData, setTransferData] = useState(null);
    
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/students_conntroller/student");

        const user = data;

        setProfile({
          avatar: user.profile.student_image,
          nameEn: user.profile.personal_information.name_english,
          nameAr: user.profile.personal_information.name_arabic,
          nationality: user.profile.personal_information.nationality,
          gender: user.profile.personal_information.gender,
          religion: user.profile.personal_information.religion,
          dob: user.profile.personal_information.date_of_birth,
          id: user.profile.personal_information.national_id,
          student_id: user.profile.personal_information.student_id,
          
        });
        setContact({
          city: user.profile.contact_information.current_city,
          street: user.profile.contact_information.current_address.street,
          address_city: user.profile.contact_information.current_address.city,
          center: user.profile.contact_information.current_address.center,
          homePhone: user.profile.contact_information.home_phone,
          personalEmail: user.profile.contact_information.student_email,
          mobile: user.profile.contact_information.student_phone,
          alternativeEmail: user.profile.contact_information.university_email,
          postalCode: user.profile.contact_information.postal_code,
          poBox: user.profile.contact_information.post_office_box,
        });
     setFamily({
  father_name:        user.profile.family_information.father_name ,
  mother_name:        user.profile.family_information.mother_name ,
  mother_occupation:  user.profile.family_information.mother_occupation,
  father_occupation:  user.profile.family_information.father_occupation,
  city:               user.profile.family_information.city             ,
  address: {
    street:           user.profile.family_information.address.street  ,
    city:             user.profile.family_information.address.city    ,
    center:           user.profile.family_information.address.center  ,
  },
  home_phone:         user.profile.family_information.home_phone       ,
  student_phone:      user.profile.family_information.student_phone    ,
  student_email:      user.profile.family_information.student_email    ,
});
setQ({
  school_name:                  user.profile.previous_qualifications.school_name,
  school_location:              user.profile.previous_qualifications.school_location,
  graduation_year:              user.profile.previous_qualifications.graduation_year,
  seat_number:                  user.profile.previous_qualifications.seat_number,
  coordination_approval_number: user.profile.previous_qualifications.coordination_approval_number,
  coordination_approval_date:   user.profile.previous_qualifications.coordination_approval_date,
  qualification_type:           user.profile.previous_qualifications.qualification_type,
  score:                        user.profile.previous_qualifications.score,
  total_score:                  user.profile.previous_qualifications.total_score,
});
setTransferData({
  transferring_authority:        user.profile.transfer_information.transferring_authority,
  result_of_military_education:  user.profile.transfer_information.result_of_military_education,
  year_of_enrollment:            user.profile.transfer_information.year_of_enrollment,
});


    
      } catch (err) {
        console.error("Error fetching profile:", err);

        if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load profile");
        }
      }
    };

    fetchProfile();
  }, []);

  return { profile, error,contact, family,q,transferData};
}