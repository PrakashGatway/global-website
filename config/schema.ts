export const profileSchema = {
   profile: {
    title: "Personal Information",

    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        validation: {
          minLength: 2,
          message: "full name must be at least 2 characters"
        }
      },



      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        required: true
      },

      {
        name: "firstLanguage",
        label: "First Language",
        type: "text",
        required: true
      },

      {
        name: "nationality",
        label: "Country of Citizenship",
        type: "select",
        options: [
          "India",
          "Canada",
          "USA",
          "UK",
          "Australia"
        ],
        required: true
      },

      {
        name: "passportNumber",
        label: "Passport Number",
        type: "text",
        required: false,
        validation: {
          minLength: 6,
          message: "Invalid passport number"
        }
      },

      {
        name: "passportExpiry",
        label: "Passport Expiry Date",
        type: "date",
        required: false
      },

      {
        name: "maritalStatus",
        label: "Marital Status",
        type: "radio",
        options: ["Single", "Married"],
        required: true
      },

      {
        name: "gender",
        label: "Gender",
        type: "radio",
        options: ["male", "female", "other"],
        required: true
      }
    ]
  },

  address: {
    title: "Address Details",

    fields: [
      {
        name: "address",
        label: "Address",
        type: "text",
        required: true,
        validation: {
          minLength: 5,
          message: "Address too short"
        },
        col: 2
      },

      {
        name: "city",
        label: "City",
        type: "text",
        required: true
      },

      {
        name: "country",
        label: "Country",
        type: "select",
        options: ["India", "Canada", "UK"],
        required: true
      },

      {
        name: "state",
        label: "State",
        type: "text",
        required: true
      },

      {
        name: "zip",
        label: "Postal Code",
        type: "text",
        validation: {
          pattern: /^[0-9]{5,6}$/,
          message: "Invalid postal code"
        }
      }
    ]
  },
  education: {
    title: "Education History",
    type: "multi",
    sections: {
      summary: {
        type: "single",   // one form
        title: "Education Summary",
        fields: [
          {
            name: "countryOfEducation",
            label: "Country of education",
            type: "select",
            required: true,
            options: ["India", "Canada", "USA"]
          },
          {
            name: "highestEducationLevel",
            label: "Highest level of education",
            type: "select",
            required: true,
            options: ["Grade 10","Grade 12","Diploma","Bachelor"]
          },
          {
            name: "gradingScheme",
            label: "Grading scheme",
            type: "select",
            required: true,
            options: ["Percentage","CGPA"]
          },
          {
            name: "graduated",
            label: "I have graduated",
            type: "radio",
            options: ["yes","no"],
            required: true,
            col: 2
          }
        ]
      },

      schools: {
        type: "repeatable",   // ⭐ IMPORTANT
        title: "Schools Attended",

        fields: [
          {
            name: "country",
            label: "Country of institution",
            type: "select",
            required: true
          },
          {
            name: "institutionName",
            label: "Name of institution",
            type: "text",
            required: true
          },
          {
            name: "educationLevel",
            label: "Level of education",
            type: "select",
            required: true
          },
          {
            name: "gradingScheme",
            label: "Grading Scheme",
            type: "select",
            required: true
          },
          {
            name: "startDate",
            label: "Attended institution from",
            type: "date",
            required: true
          },
          {
            name: "endDate",
            label: "Attended institution to",
            type: "date",
            required: true
          },
          {
            name: "degreeName",
            label: "Degree name",
            type: "text"
          },

          // school address
          {
            name: "address",
            label: "Address",
            type: "text",
            col: 2
          },
          {
            name: "city",
            label: "City/Town",
            type: "text"
          },
          {
            name: "state",
            label: "Province / State",
            type: "text"
          },
          {
            name: "postalCode",
            label: "Postal / Zip code",
            type: "text"
          }
        ]
      }
    }
  }

  
};
