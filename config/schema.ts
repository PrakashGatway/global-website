export const profileSchema = {
  profile: {
    title: "Personal Information",

    fields: [
      {
        name: "name",
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
        optionsSource: "countries",
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
        options: [
          { label: "Single", value: "Single" },
          { label: "Married", value: "Married" }
        ],
        required: true
      },

      {
        name: "gender",
        label: "Gender",
        type: "radio",
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" }
        ],
        required: true
      }
    ]
  },

  address: {
    title: "Address Details",

    fields: [
      {
        name: "address1",
        label: "Address Line 1",
        type: "text",
        required: true,
        validation: {
          minLength: 5,
          message: "Address too short"
        },
        col: 2
      },
      {
        name: "address2",
        label: "Address Line 2",
        type: "text",
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
        optionsSource: "countries",
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
        name: "postalcode",
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
            name: "country",
            label: "Country of education",
            type: "select",
            optionsSource: "countries",
            required: true,
            options: ["India", "Canada", "USA"]
          },
          {
            name: "highestEducationLevel",
            label: "Highest level of education",
            type: "select",
            required: true,
            options: ["Grade 10", "Grade 12", "Diploma", "Bachelor"]
          },
          {
            name: "gradingScheme",
            label: "Grading scheme",
            type: "select",
            required: true,
            options: ["Percentage", "CGPA"]
          },
          {
            name: "graduated",
            label: "I have graduated",
            type: "radio",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" }
            ],
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
            optionsSource: "countries",
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
            required: true,
            options: ["Grade1", "Grade2", "Grade3"]
          },
          {
            name: "gradingScheme",
            label: "Grading Scheme",
            type: "select",
            required: true,
            options: ["Other"]
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
  },

  testscore: {
    title: "English Test Scores",
    type: "multi",

    sections: {
      englishscore: {
        title: "English Test Scores",
        type: "single",

        fields: [
          {
            name: "englishStatus",
            label: "English language proficiency",
            type: "radio",

            options: [
              {
                label: "I have valid proof of English language proficiency",
                value: "hasTest",

                // 👇 only this option shows test selector
                children: [
                  {
                    name: "englishTest",
                    label: "Select Test Type",
                    type: "radio",

                    options: [
                      {
                        label: "TOEFL",
                        value: "toefl",
                        scoreGroup: {
                          title: "Your Scores",
                          fields: [
                            { name: "reading", label: "Reading", type: "number", required: true },
                            { name: "listening", label: "Listening", type: "number", required: true },
                            { name: "writing", label: "Writing", type: "number", required: true },
                            { name: "speaking", label: "Speaking", type: "number", required: true },
                            { name: "examDate", label: "Date of exam", type: "date", required: true }
                          ]
                        }
                      },

                      {
                        label: "IELTS",
                        value: "ielts",
                        scoreGroup: {
                          title: "Your Scores",
                          fields: [
                            { name: "reading", type: "number", label: "Reading", required: true },
                            { name: "listening", type: "number", label: "Listening", required: true },
                            { name: "writing", type: "number", label: "Writing", required: true },
                            { name: "speaking", type: "number", label: "Speaking", required: true },
                            { name: "examDate", type: "date", label: "Date of exam", required: true }
                          ]
                        }
                      },

                      {
                        label: "PTE",
                        value: "pte",
                        scoreGroup: {
                          title: "Your Scores",
                          fields: [
                            { name: "totalScore", label: "Total Score", type: "number", required: true },
                            { name: "examDate", label: "Date of exam", type: "date", required: true }
                          ]
                        }
                      },

                      {
                        label: "Duolingo",
                        value: "duolingo",
                        scoreGroup: {
                          title: "Your Scores",
                          fields: [
                            { name: "totalScore", label: "Total Score", type: "number", required: true },
                            { name: "examDate", label: "Date of exam", type: "date", required: true }
                          ]
                        }
                      },
                      {
                        label: "Other tests",
                        value: "othertest",
                        tooltip: "When this option is selected, we will assume that you meet the language proficiency requirements for all programs and bypass the language proficiency check on the search page. This may cause programs to appear for which you are not eligible. Your precise eligibility will be evaluated later, after you create an application and upload the required documents."
                      }
                    ]
                  }
                ]
              },

              {
                label:
                  "I have not taken a language test and will apply to programs allowing proof after acceptance",
                value: "afterAcceptance"
              },

              {
                label:
                  "I believe my academic or nationality background qualifies me for an exemption",
                value: "exemption"
              },

              {
                label:
                  "I have not taken a language test and do not plan to take one",
                value: "noTest"
              }
            ]
          }
        ]
      },
      coursescore: {
  title: "GRE or GMAT Scores",
  type: "single",

  fields: [
    {
      name: "hasGmat",
      label: "I have GMAT exam scores",
      type: "switch",
      defaultValue: false,

      children: [
        {
          name: "gmatTotal",
          label: "Total",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "gmatVerbal",
          label: "Verbal",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "gmatQuantitative",
          label: "Quantitative",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "gmatAwa",
          label: "AWA",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "gmatExamDate",
          label: "Date of exam",
          type: "date",
          required: true
        }
      ]
    },

    {
      name: "hasGre",
      label: "I have GRE exam scores",
      type: "switch",
      defaultValue: false,

      children: [
        {
          name: "greTotal",
          label: "Total",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "greVerbal",
          label: "Verbal",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "greQuantitative",
          label: "Quantitative",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "greAwa",
          label: "AWA",
          type: "scoreGroup",
          fields: [
            { name: "score", label: "Score", type: "number", required: true },
            { name: "rank", label: "Rank %", type: "number", required: true }
          ]
        },
        {
          name: "greExamDate",
          label: "Date of exam",
          type: "date",
          required: true
        }
      ]
    }
  ]
}
    }
  },

  visaStudypermit: {
    title: "Visa & Study Permit",
    type: "single",

    fields: [
      {
        name: "visaRefused",
        label:
          "Have you been refused a visa from Canada, the USA, the United Kingdom, New Zealand, Australia or Ireland?",
        type: "radio",
        required: true,

        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],

        tooltip:
          "Include any past visa refusals. This information helps assess eligibility."
      },

      {
        name: "validVisas",
        label: "Which valid study permits or visas do you have?",
        type: "checkbox",

        options: [
          {
            label: "Canadian Study Permit / Visitor Visa",
            value: "canada"
          },
          {
            label: "USA F1 Visa",
            value: "usa"
          },
          {
            label: "Australian Study Visa",
            value: "australia"
          },
          {
            label: "UK Tier 4 Student / Short Term Study Visa",
            value: "uk"
          },
          {
            label: "Irish Stamp 2",
            value: "ireland"
          },
          {
            label: "I don't have this",
            value: "none"
          }
        ]
      },

      {
        name: "visaDetails",
        label:
          "Please provide more information about your current study permit/visa and any past refusals, if any",
        type: "textarea",
        placeholder: "Enter your details..."
      }
    ]
  }






};
