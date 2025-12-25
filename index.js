// ========== CONTACT FORM VALIDATION AND SUBMISSION ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    // Check if form exists on this page
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    
    // Create error message elements if they don't exist
    function createErrorElements() {
        const inputs = [nameInput, emailInput, messageInput];
        inputs.forEach(input => {
            if (!document.getElementById(input.id + 'Error')) {
                const errorElement = document.createElement('div');
                errorElement.id = input.id + 'Error';
                errorElement.className = 'form-error';
                errorElement.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 5px; display: none;';
                // Find the parent div to append error message
                const inputContainer = input.parentNode;
                if (inputContainer) {
                    inputContainer.parentNode.appendChild(errorElement);
                }
            }
        });
    }
    
    createErrorElements();
    
    // Input focus effects
    const inputs = [nameInput, emailInput, messageInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#6e8efb';
            this.style.boxShadow = '0 0 0 3px rgba(110, 142, 251, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e1e1e1';
            this.style.boxShadow = 'none';
            validateField(this);
        });
        
        // Clear error when user starts typing
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            this.style.borderColor = '#e1e1e1';
        });
    });
    
    // Field validation
    function validateField(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (field.value.trim() === '') {
            showError(field, errorElement, 'This field is required');
            return false;
        }
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (field.id === 'name' && field.value.trim().length < 2) {
            showError(field, errorElement, 'Name must be at least 2 characters');
            return false;
        }
        
        if (field.id === 'message' && field.value.trim().length < 10) {
            showError(field, errorElement, 'Message must be at least 10 characters');
            return false;
        }
        
        // If valid
        hideError(field, errorElement);
        return true;
    }
    
    function showError(field, errorElement, message) {
        field.style.borderColor = '#e74c3c';
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function hideError(field, errorElement) {
        field.style.borderColor = '#2ecc71';
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // Form submission - prevent default and handle with web3forms
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        console.log("Form submission started...");
        
        // Validate all fields
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            console.log("Form validation failed");
            // Scroll to first error
            const firstError = document.querySelector('.form-error[style*="display: block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Change button text to show loading
        const originalButtonText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(form);
        
        console.log("Submitting to web3forms...");
        
        // Submit to web3forms
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log("Response received:", response);
            return response.json();
        })
        .then(data => {
            console.log("Web3forms response:", data);
            
            if (data.success) {
                // Show success message
                successMessage.style.display = 'block';
                console.log("Form submitted successfully!");
                
                // RESET FORM FIELDS - This is the fix
                form.reset();
                console.log("Form fields reset");
                
                // Reset all input borders
                inputs.forEach(input => {
                    input.style.borderColor = '#e1e1e1';
                    const errorElement = document.getElementById(input.id + 'Error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    console.log("Success message hidden");
                }, 5000);
                
                // Scroll to show success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Show error message
                alert('There was an error sending your message. Please try again.');
                console.error("Web3forms error:", data);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert('There was an error sending your message. Please try again.');
        })
        .finally(() => {
            // Reset button
            submitBtn.innerHTML = originalButtonText;
            submitBtn.disabled = false;
            console.log("Submit button reset");
        });
    });
    
    // Button hover effect
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 7px 15px rgba(110, 142, 251, 0.3)';
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }
});

// ========== COMPLETE TEAM DATA OBJECTS - ALL PORTFOLIO DETAILS ==========

  // Utility functions to work with team data
  function getTeamMembersByYear(year) {
    return teamData[year] || null;
  }

  function getTeamMemberByName(name, year = "2023-2024") {
    const yearData = teamData[year];
    if (!yearData) return null;
    
    // Search in core team
    let member = yearData.core.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (member) return { ...member, team: "core", year: year };
    
    // Search in execom team
    member = yearData.execom.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (member) return { ...member, team: "execom", year: year };
    
    return null;
  }

  function getAllTeamMembersByDesignation(designation) {
    const results = [];
    Object.keys(teamData).forEach(year => {
      const yearData = teamData[year];
      yearData.core.forEach(member => {
        if (member.designation.toLowerCase().includes(designation.toLowerCase())) {
          results.push({ ...member, team: "core", year: year });
        }
      });
      yearData.execom.forEach(member => {
        if (member.designation.toLowerCase().includes(designation.toLowerCase())) {
          results.push({ ...member, team: "execom", year: year });
        }
      });
    });
    return results;
  }

  function getTeamStats() {
    const stats = {};
    Object.keys(teamData).forEach(year => {
      const yearData = teamData[year];
      stats[year] = {
        coreCount: yearData.core.length,
        execomCount: yearData.execom.length,
        totalCount: yearData.core.length + yearData.execom.length
      };
    });
    return stats;
  }

  // Console helper functions for easy access
  console.log("Team Data Objects Loaded Successfully!");
  console.log("Available functions:");
  console.log("- getTeamMembersByYear('2023-2024')");
  console.log("- getTeamMemberByName('CHARITHA')");
  console.log("- getAllTeamMembersByDesignation('CHAIR-PERSON')");
  console.log("- getTeamStats()");
  console.log("- teamData (access full data object)");
  
// Only include if not already defined elsewhere
const teamData = {
    '2k25-2k26': {
        core: [
            { name: 'MARAPALLY ROHAN GUPTA', designation: 'CHAIR-PERSON', yearBranch: 'IV CSM' , img: 'assets/images/rohan-gupta.jpeg'  },
            { name: 'NEELAM SREEJA', designation: 'VICE CHAIR PERSON', yearBranch: 'IV ECE' ,img: 'assets/images/NEELAM SREEJA.jpeg'},
            { name: 'G. VARSHITH', designation: 'DIRECTOR', yearBranch: 'IV ECE' },
            { name: 'U.SAI CHARAN', designation: 'DEPUTY DIRECTOR', yearBranch: 'III CSM' , img: 'assets/images/sai-charan-u.jpeg'  },
            { name: 'SAI TEJA JINDE', designation: 'SECRETARY', yearBranch: 'IV IT' },
            { name: 'MANGA SUMANTH', designation: 'IETE REPRESENTATIVE & TREASURY LEAD', yearBranch: 'IV ECE', img: 'assets/images/MANGA SUMANTH.jpeg'  },
            { name: 'A THRIBHUVANAASHRITHA', designation: 'DOCUMENTATION LEAD', yearBranch: 'IV ECE', img: 'assets/images/THRIBHUVANAASHRITHA A.jpeg'  },
            { name: 'GAYATHRI JEEGURU', designation: 'GRAPHIC DESIGNING LEAD', yearBranch: 'III CSE' },
            { name: 'MANTHENA DEEPAK', designation: 'MARKETING, IETE MEMBERSHIP', yearBranch: 'IV CSM' , img: 'assets/images/manthena-deepak.jpeg'  },
            { name: 'T.NAMRUTHA', designation: 'SOCIAL MEDIA PROMOTIONS LEAD', yearBranch: 'III CSM', img: 'assets/images/namrutha-t.jpeg'  },
            { name: 'NAVYA', designation: 'OPERATIONS LEAD', yearBranch: 'IV CSC', img: 'assets/images/navya.jpeg' },
            { name: 'GANDU SACHIN', designation: 'WEB DEVELOPMENT LEAD', yearBranch: 'IV CSD', img: 'assets/images/sachin-gandu.jpeg'  },
            { name: 'RAJ MEHATHA', designation: 'IET LEAD', yearBranch: 'IV CSD' }
        ],
        exec: [
            { name: 'KRISHNA TEJA', designation: 'JOINT SECRETARY', yearBranch: 'III CSM', img: 'assets/images/krishna-teja.jpeg'  },
            { name: 'B. ROHINI', designation: 'IETE REPRESENTATIVE', yearBranch: 'III CSM' },
            { name: 'ADNAN ULLAH KARAMALI', designation: 'TREASURY', yearBranch: 'II CSD', img: 'assets/images/adnan-ullah-karamali.jpeg'  },
            { name: 'KOTHA MANI KUMAR', designation: 'TREASURY', yearBranch: 'II EEE', img: 'assets/images/mani-kumar-kotha.jpeg'  },
            { name: 'G NEHASRI', designation: 'DOCUMENTATION', yearBranch: 'III CSM' , img: 'assets/images/nehasri-g.jpeg'  },
            { name: 'KAMMARI SAIKIRAN', designation: 'DOCUMENTATION', yearBranch: 'III CSM', img: 'assets/images/saikiran-kammari.jpeg'  },
            { name: 'NAGA MANASWINI', designation: 'DOCUMENTATION', yearBranch: 'II ECE', img: 'assets/images/manaswini-naga.jpeg'  },
            { name: 'VISHNUPRIYA', designation: 'DOCUMENTATION', yearBranch: 'II ECE', img: 'assets/images/vishnupriya.jpeg'  },
            { name: 'NAMPALLY VIGNESH', designation: 'DESIGN', yearBranch: 'III ECE' , img: 'assets/images/vignesh-nampally.jpeg'  },
            { name: 'ROHINI MUPPALA', designation: 'DESIGN', yearBranch: 'III IT', img: 'assets/images/rohini-muppala.jpeg'  },
            { name: 'VARUN KUMAR', designation: 'DESIGN', yearBranch: 'III CSM', img: 'assets/images/varun-kumar.jpeg'  },
            { name: 'DEEPAK SANGALA', designation: 'DESIGN', yearBranch: 'II CSE', img: 'assets/images/deepak-sangala.jpeg'  },
            { name: 'KOTTA SAI PRANEETH', designation: 'OPERATIONS', yearBranch: 'III CSM', img: 'assets/images/praneeth-kotta.jpeg'  },
            { name: 'SPOORTHY RAO', designation: 'OPERATIONS', yearBranch: 'III ECE', img: 'assets/images/spoorthy-rao.jpeg'  },
            { name: 'ERUKU KAVYA', designation: 'MARKETING', yearBranch: 'III CSM', img: 'assets/images/kavya-eruku.jpeg'  },
            { name: 'JAHNAVI P', designation: 'MARKETING', yearBranch: 'III CSBS', img: 'assets/images/jahnavi-p.jpeg'  },
            { name: 'N SANDEEP GOUD', designation: 'MARKETING', yearBranch: 'II ECE', img: 'assets/images/sandeep-goud-n.jpeg'  },
            { name: 'SREENIDHI ANANTHULA', designation: 'MARKETING', yearBranch: 'II EEE', img: 'assets/images/sreenidhi-ananthula.jpeg'  },
            { name: 'G SRAVYA', designation: 'SOCIAL MEDIA PROMOTIONS', yearBranch: 'III CSD', img: 'assets/images/sravya-g.jpeg'  },
            { name: 'NAVYA SRIRAMULA', designation: 'SOCIAL MEDIA PROMOTions', yearBranch: 'III CSM', img: 'assets/images/navya-sriramula.jpeg'  },
            { name: 'P KALPANA GOUD', designation: 'IETE REPRESENTATIVE', yearBranch: 'III CSC', img: 'assets/images/kalpana-goud-p.jpeg'  },
            { name: 'S JYOSTHSNA', designation: 'IETE REPRESENTATIVE', yearBranch: 'III CSM', img: 'assets/images/jyosthsna-s.jpeg'  },
            { name: 'DEEPTHI AMUDALA', designation: 'SST REPRESENTATIVE', yearBranch: 'II ECE', img: 'assets/images/deepthi-amudala.jpeg'  },
            { name: 'R VENKATESHWARI', designation: 'RESEARCH CREW', yearBranch: 'III CSM', img: 'assets/images/venkateshwari-r.jpeg'  },
            { name: 'B MANOJ KUMAR', designation: 'RESEARCH CREW', yearBranch: 'II CSD', img: 'assets/images/manoj-kumar-b.jpeg'  },
            { name: 'LAKSH BHUTADA', designation: 'RESEARCH CREW', yearBranch: 'II CSM', img: 'assets/images/laksh-bhutada.jpeg'  },
            { name: 'VENUDHAR REDDY', designation: 'RESEARCH CREW', yearBranch: 'II ECE', img: 'assets/images/venudhar-reddy.jpeg'  },
            { name: 'MOGULLA MOSES', designation: 'IET REPRESENTATIVE', yearBranch: 'III CSD', img: 'assets/images/mogulla-moses.jpeg'  },
            { name: 'NAVYA ANGALA', designation: 'DATA CRAFTERS', yearBranch: 'III ECE', img: 'assets/images/navya-angala.jpeg'  },
            { name: 'MANOOR LAXMI PRAGNITHA', designation: 'DATA APPERENTICE', yearBranch: 'II CSD', img: 'assets/images/laxmi-pragnitha-manoor.jpeg'  },
            { name: 'REVANTH KUMAR ADIMULAM', designation: 'DATA APPERENTICE', yearBranch: 'II ECE', img: 'assets/images/revanth-kumar-adimulam.jpeg'  },
            { name: 'THADUKA AKSHITH', designation: 'ML ENGINEER', yearBranch: 'III CSM', img: 'assets/images/akshith-thaduka.jpeg'  },
            { name: 'KOTHA SAI PRANEETH', designation: 'ML ENGINEER', yearBranch: 'III CSM', img: 'assets/images/praneeth-kotha.jpeg'  },
            { name: 'PUJITHA', designation: 'WEB DEVELOPMENT', yearBranch: 'III CSBS', img: 'assets/images/pujitha.jpeg'  },
            { name: 'VAISHNAVI', designation: 'WEB DEVELOPMENT', yearBranch: 'III CSBS', img: 'assets/images/vaishnavi.jpeg'  },
            { name: 'VIKRANTH', designation: 'WEB DEVELOPMENT', yearBranch: 'III CSBS', img: 'assets/images/vikranth.jpeg'  },
            
        ]
    },
    '2k24-2k25': {
        core: [
            { name: 'CHARITHA GUNDAMPATI', designation: 'CHAIR-PERSON', yearBranch: 'IV IT' },
            { name: 'ARIGE SAI YASHWANTH', designation: 'VICE CHAIR PERSON & DESIGN LEAD', yearBranch: 'IV ECE' },
            { name: 'BALARAMA KRISHNA GOPARAJU', designation: 'DIRECTOR SST', yearBranch: 'III CSM' },
            { name: 'KEERTHI UTTANOORU', designation: 'DEPUTY DIRECTOR SST', yearBranch: 'IV CSE' },
            { name: 'CHARAN BOLLAPALLY', designation: 'SECRETARY', yearBranch: 'IV IT' },
            { name: 'SIRIPURAM RAHUL', designation: 'IETE REPRESENTATIVE', yearBranch: 'IV ECE' },
            { name: 'MANIDEEP CHOWDARY', designation: 'TREASURER', yearBranch: 'IV ECE' },
            { name: 'GANDU SACHIN', designation: 'WEBDEVELOPMENT LEAD', yearBranch: 'IV CSD' },
            { name: 'DYAGA HARSHA VARDHAN', designation: 'OPERATIONS & SMP LEAD', yearBranch: 'IV EEE' },
            { name: 'MARREPALLY VINAY SAI', designation: 'MARKETING LEAD', yearBranch: 'IV ECE' }
        ],
        exec: [
            { name: 'KALYAN RAM', designation: 'JOINT SECRETARY', yearBranch: 'III CSE' },
            { name: 'P. V. S. D. D. MALLIKARJUNA', designation: 'REPRESENTATIVE IETE', yearBranch: 'III ECE' },
            { name: 'KARTHIK REDDY KARAKALA', designation: 'TREASURY', yearBranch: 'III CSD' },
            { name: 'R. MEGHANA', designation: 'DOCUMENTATION (CO-ORDINATOR)', yearBranch: 'III CSC' },
            { name: 'AFREEN', designation: 'DOCUMENTATION', yearBranch: 'III CSD' },
            { name: 'DHANUSHYM', designation: 'DOCUMENTATION', yearBranch: 'III CSC' },
            { name: 'AKHIL SAMPATH VINAY', designation: 'DESIGN', yearBranch: 'III CSC' },
            { name: 'VYSHNAVI', designation: 'DESIGN', yearBranch: 'III CSC' },
            { name: 'RAMYA KOPUROTU', designation: 'DESIGN', yearBranch: 'III CSM' },
            { name: 'N. SRI ABHINAV', designation: 'OPERATIONS (CO-ORDINATOR)', yearBranch: 'II CSE' },
            { name: 'ANANYA NAYINI', designation: 'OPERATIONS', yearBranch: 'III CSD' },
            { name: 'SAHITHI PAKALA', designation: 'OPERATIONS', yearBranch: 'III IT' },
            { name: 'UDAY JALLAPURAM', designation: 'OPERATIONS', yearBranch: 'II CSE' },
            { name: 'B. REVANTH', designation: 'MARKETING (CO-ORDINATOR)', yearBranch: 'III CSC' },
            { name: 'VIDHITHA REDDY PAISA', designation: 'MARKETING', yearBranch: 'II CSD' },
            { name: 'SNEHITH REDDY KONUGANTI', designation: 'SOCIAL MEDIA PROMOTIONS & MEDIA AND PUBLIC RELATIONS', yearBranch: 'III CSE' },
            { name: 'MARAPALLY ROHAN GUPTA', designation: 'SST REPRESENTATIVE', yearBranch: 'II CSM' },
            { name: 'NITHYA SRI', designation: 'RESEARCH CREW (CO-ORDINATOR)', yearBranch: 'II CSE' },
            { name: 'NIKHITHA GATTOGI', designation: 'RESEARCH CREW', yearBranch: 'III CSM' },
            { name: 'VISHNU PREETHI', designation: 'RESEARCH CREW', yearBranch: 'III CSB' },
            { name: 'JETHIN JENGITI', designation: 'RESEARCH CREW', yearBranch: 'III CSM' }
        ]
    },
    '2k23-2k24': {
        core: [
            { name: 'CHARITHA GUNDAMPATI', designation: 'CHAIR-PERSON', yearBranch: 'IV IT' },
            { name: 'ARIGE SAI YASHWANTH', designation: 'VICE CHAIR PERSON & DESIGN LEAD', yearBranch: 'IV ECE' },
            { name: 'BALARAMA KRISHNA GOPARAJU', designation: 'DIRECTOR SST', yearBranch: 'III CSM' },
            { name: 'KEERTHI UTTANOORU', designation: 'DEPUTY DIRECTOR SST', yearBranch: 'IV CSE' },
            { name: 'CHARAN BOLLAPALLY', designation: 'SECRETARY', yearBranch: 'IV IT' },
            { name: 'SIRIPURAM RAHUL', designation: 'IETE REPRESENTATIVE', yearBranch: 'IV ECE' },
            { name: 'MANIDEEP CHOWDARY', designation: 'TREASURER', yearBranch: 'IV ECE' },
            { name: 'SAHITHI NUKA', designation: 'DOCUMENTATION LEAD', yearBranch: 'IV ECE' },
            { name: 'DYAGA HARSHA VARDHAN', designation: 'OPERATIONS & SMP LEAD', yearBranch: 'IV EEE' },
            { name: 'MARREPALLY VINAY SAI', designation: 'MARKETING LEAD', yearBranch: 'IV ECE' }
        ],
        exec: [
            { name: 'KALYAN RAM', designation: 'JOINT SECRETARY', yearBranch: 'III CSE' },
            { name: 'P. V. S. D. D. MALLIKARJUNA', designation: 'REPRESENTATIVE IETE', yearBranch: 'III ECE' },
            { name: 'KARTHIK REDDY KARAKALA', designation: 'TREASURY', yearBranch: 'III CSD' },
            { name: 'R. MEGHANA', designation: 'DOCUMENTATION (CO-ORDINATOR)', yearBranch: 'III CSC' },
            { name: 'AFREEN', designation: 'DOCUMENTATION', yearBranch: 'III CSD' },
            { name: 'DHANUSHYM', designation: 'DOCUMENTATION', yearBranch: 'III CSC' },
            { name: 'AKHIL SAMPATH VINAY', designation: 'DESIGN', yearBranch: 'III CSC' },
            { name: 'VYSHNAVI', designation: 'DESIGN', yearBranch: 'III CSC' },
            { name: 'RAMYA KOPUROTU', designation: 'DESIGN', yearBranch: 'III CSM' },
            { name: 'N. SRI ABHINAV', designation: 'OPERATIONS (CO-ORDINATOR)', yearBranch: 'II CSE' },
            { name: 'ANANYA NAYINI', designation: 'OPERATIONS', yearBranch: 'III CSD' },
            { name: 'SAHITHI PAKALA', designation: 'OPERATIONS', yearBranch: 'III IT' },
            { name: 'UDAY JALLAPURAM', designation: 'OPERATIONS', yearBranch: 'II CSE' },
            { name: 'B. REVANTH', designation: 'MARKETING (CO-ORDINATOR)', yearBranch: 'III CSC' },
            { name: 'VIDHITHA REDDY PAISA', designation: 'MARKETING', yearBranch: 'II CSD' },
            { name: 'SNEHITH REDDY KONUGANTI', designation: 'SOCIAL MEDIA PROMOTIONS & MEDIA AND PUBLIC RELATIONS', yearBranch: 'III CSE' },
            { name: 'MARAPALLY ROHAN GUPTA', designation: 'SST REPRESENTATIVE', yearBranch: 'II CSM' },
            { name: 'NITHYA SRI', designation: 'RESEARCH CREW (CO-ORDINATOR)', yearBranch: 'II CSE' },
            { name: 'NIKHITHA GATTOGI', designation: 'RESEARCH CREW', yearBranch: 'III CSM' },
            { name: 'VISHNU PREETHI', designation: 'RESEARCH CREW', yearBranch: 'III CSB' },
            { name: 'JETHIN JENGITI', designation: 'RESEARCH CREW', yearBranch: 'III CSM' }
        ]
    },
    '2k22-2k23': {
        core: [
            { name: 'VINISHA KASANAGOTTU', designation: 'CHAIR-PERSON', yearBranch: 'IV EEE' },
            { name: 'JAHNAVI MAHADASI', designation: 'VICE CHAIR PERSON', yearBranch: 'IV ECE' },
            { name: 'MANEESH BANKA', designation: 'DIRECTOR SST', yearBranch: 'IV ECE' },
            { name: 'SUNNY KRISHNA', designation: 'DEPUTY DIRECTOR SST', yearBranch: 'IV ECE' },
            { name: 'SUPRIYA LOKURTHY', designation: 'SECRETARY', yearBranch: 'IV ECE' },
            { name: 'SAIRAM GADDEM', designation: 'IETE REPRESENTATIVE', yearBranch: 'IV ECE' },
            { name: 'JUGAL KISHORE', designation: 'TREASURER', yearBranch: 'IV ECE' },
            { name: 'NAVYA TIRUMANADHAM', designation: 'DESIGN LEAD', yearBranch: 'IV EEE' },
            { name: 'P. V. B. JANAKI', designation: 'DOCUMENTATION LEAD', yearBranch: 'IV ECE' },
            { name: 'PALLUPU PARAMESHWARI', designation: 'OPERATIONS LEAD', yearBranch: 'IV ECE' },
            { name: 'V. HARSHA VARDHAN', designation: 'MARKETING & SMP LEAD', yearBranch: 'IV MECH' },
            { name: 'KOTHA SUMA REDDY', designation: 'WEB DESIGNING LEAD', yearBranch: 'IV CSE' }
        ],
        exec: [
            { name: 'CHARITHA GUNDAMPATI', designation: 'JOINT SECRETARY', yearBranch: 'III IT' },
            { name: 'DHARAHAS SUDDALA', designation: 'REPRESENTATIVE', yearBranch: 'III IT' },
            { name: 'MANIDEEP CHOWDARY', designation: 'TREASURY', yearBranch: 'III ECE' },
            { name: 'SAHITHI NUKA', designation: 'DOCUMENTATION (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'SHIVADHAR GODUMALA', designation: 'DOCUMENTATION', yearBranch: 'III ECE' },
            { name: 'E. ANJAN KUMAR', designation: 'DOCUMENTATION', yearBranch: 'III IT' },
            { name: 'P. SIVA TEJA', designation: 'DESIGN', yearBranch: 'II CSM' },
            { name: 'RUKMINI', designation: 'DESIGN', yearBranch: 'III CSD' },
            { name: 'CHARAN BOLLAPALLY', designation: 'OPERATIONS', yearBranch: 'III IT' },
            { name: 'D. HARSHA VARDHAN', designation: 'OPERATIONS', yearBranch: 'III EEE' },
            { name: 'AKHILA CHOWDARY', designation: 'OPERATIONS', yearBranch: 'III CSD' },
            { name: 'HANSIKA GONE', designation: 'OPERATIONS', yearBranch: 'III ECE' },
            { name: 'SRINIVASA CHARY', designation: 'MARKETING (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'SIRIPURAM RAHUL', designation: 'MARKETING', yearBranch: 'III ECE' },
            { name: 'MARREPALLY VINAY SAI', designation: 'MARKETING', yearBranch: 'III ECE' },
            { name: 'ARIGE SAI YASHWANTH', designation: 'SOCIAL MEDIA PROMOTIONS', yearBranch: 'III ECE' },
            { name: 'P. AMRUTH VARSH', designation: 'MEDIA AND PUBLIC RELATIONS & RESEARCH CREW', yearBranch: 'II CSM' },
            { name: 'B. REVANTH', designation: 'WEB DESIGNING', yearBranch: 'III CSC' },
            { name: 'KOLKURI SINDHUJA', designation: 'SST (REPRESENTATIVE)', yearBranch: 'III ECE' },
            { name: 'BALARAMA KRISHNA GOPARAJU', designation: 'SST (CO-ORDINATOR)', yearBranch: 'II CSM' },
            { name: 'UTTANOORU KEERTHI REDDY', designation: 'SST', yearBranch: 'III CSE' },
            { name: 'CHITRA', designation: 'SST', yearBranch: 'III CSE' }
        ]
    },
    '2k21-2k22': {
        core: [
            { name: 'KRITHIKA ENDRALA', designation: 'CHAIR-PERSON', yearBranch: 'IV CSE' },
            { name: 'NIKITHA PEDDI', designation: 'VICE CHAIR PERSON', yearBranch: 'IV ECE' },
            { name: 'SAI SUSMITHA', designation: 'DIRECTOR SST', yearBranch: 'IV ECE' },
            { name: 'VAISHNAVI', designation: 'DEPUTY DIRECTOR SST', yearBranch: 'IV ECE' },
            { name: 'SRINIVAS', designation: 'SECRETARY', yearBranch: 'IV ECE' },
            { name: 'M.B.BHANU TEJA', designation: 'IETE REPRESENTATIVE', yearBranch: 'IV ECE' },
            { name: 'MOKSHAGNA TEJA', designation: 'TREASURER', yearBranch: 'IV CSE' },
            { name: 'NIKHITHA TALLURI', designation: 'DESIGN LEAD', yearBranch: 'III EEE' },
            { name: 'MEGHANA AVVARI', designation: 'DOCUMENTATION LEAD', yearBranch: 'III CSE' },
            { name: 'INDHUJA KOTHAPALLY', designation: 'OPERATIONS LEAD', yearBranch: 'IV CSE' },
            { name: 'POOJITHA REDDY', designation: 'MARKETING LEAD', yearBranch: 'IV ECE' }
        ],
        exec: [
            { name: 'VINISHA', designation: 'JOINT SECRETARY', yearBranch: 'III EEE' },
            { name: 'VEGESANA SANJANA', designation: 'REPRESENTATIVE', yearBranch: 'III CSE' },
            { name: 'TARUN REDDY', designation: 'TREASURY', yearBranch: 'III ECE' },
            { name: 'MOHAMMAD SAJID', designation: 'TREASURY', yearBranch: 'III CSE' },
            { name: 'NAVYA TIRUMANADHAM', designation: 'DESIGN (CO-ORDINATOR)', yearBranch: 'III EEE' },
            { name: 'UDAY KUMAR', designation: 'DESIGN', yearBranch: 'III ECE' },
            { name: 'HARSHA VARDHAN', designation: 'DESIGN', yearBranch: 'III MECH' },
            { name: 'POLASANI JAYARAM', designation: 'DESIGN', yearBranch: 'II ECE' },
            { name: 'AKASH RAMAGIRI', designation: 'DESIGN', yearBranch: 'II MECH' },
            { name: 'SONALI SANKESHI', designation: 'DOCUMENTATION (CO-ORDINATOR)', yearBranch: 'III CSE' },
            { name: 'NEERAJA PITLA', designation: 'DOCUMENTATION', yearBranch: 'III CSE' },
            { name: 'BADDAM BHARGAVI', designation: 'DOCUMENTATION', yearBranch: 'III CSE' },
            { name: 'ANUSHA ALAVALA', designation: 'DOCUMENTATION', yearBranch: 'III CSE' },
            { name: 'D. KUMAR VARUN', designation: 'DOCUMENTATION', yearBranch: 'III CSE' },
            { name: 'P V B JANAKI', designation: 'DOCUMENTATION', yearBranch: 'III ECE' },
            { name: 'SUNEETH MANIKANTA', designation: 'OPERATIONS (CO-ORDINATOR)', yearBranch: 'III EEE' },
            { name: 'JAHNAVI MAHADASI', designation: 'OPERATIONS', yearBranch: 'III ECE' },
            { name: 'KOTHA SUMA REDDY', designation: 'OPERATIONS', yearBranch: 'III CSE' },
            { name: 'JUGAL KISHORE', designation: 'OPERATIONS', yearBranch: 'III ECE' },
            { name: 'SUPRIYA LOKURTHY', designation: 'MARKETING (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'SUNNY KRISHNA', designation: 'MARKETING', yearBranch: 'III ECE' },
            { name: 'SHYNI ANNAVARAPU', designation: 'MARKETING', yearBranch: 'III ECE' },
            { name: 'PRIYANSHI SINGH', designation: 'MARKETING', yearBranch: 'II CSE' },
            { name: 'MUSKAN SINGH', designation: 'MARKETING', yearBranch: 'II CSE' },
            { name: 'SIRIPOTHULA RAHUL', designation: 'MARKETING', yearBranch: 'II CSE' },
            { name: 'PARAMESHWARI', designation: 'SOCIAL MEDIA PROMOTIONS (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'GADEM SAI RAM', designation: 'SOCIAL MEDIA PROMOTIONS', yearBranch: 'III ECE' },
            { name: 'RUSHIKA MADIPEDDI', designation: 'MEDIA AND PUBLIC RELATIONS (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'CHARITHA', designation: 'MEDIA AND PUBLIC RELATIONS', yearBranch: 'II IT' },
            { name: 'BHANU PRAKASH', designation: 'SST (REPRESENTATIVE)', yearBranch: 'III ECE' },
            { name: 'MANEESH BANKA', designation: 'SST (CO-ORDINATOR)', yearBranch: 'III ECE' },
            { name: 'ANMISHA NANDURI', designation: 'SST', yearBranch: 'III CSE' },
            { name: 'NAONIT KUMAR GOUTAM', designation: 'SST', yearBranch: 'III ECE' },
            { name: 'PRUDHVI TEJA', designation: 'SST', yearBranch: 'III ECE' },
            { name: 'LONKA SAMBA RAJU', designation: 'SST', yearBranch: 'III ECE' },
            { name: 'ZUHA SIDDIQUI', designation: 'SST', yearBranch: 'II CSE' },
            { name: 'HEMANTH MANDRA', designation: 'SST', yearBranch: 'III ECE' },
            { name: 'MADHAVAN RAO', designation: 'SST', yearBranch: 'II MECH' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const teamDisplay = document.getElementById('teamDisplay');
    const teamTitle = document.getElementById('teamTitle');
    const teamGrid = document.getElementById('teamGrid');
    const backButton = document.getElementById('backButton');

   function createMemberCard(member) {
  const card = document.createElement('div');
  card.style.backgroundColor = 'white';
  card.style.borderRadius = '10px';
  card.style.padding = '20px';
  card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
  card.style.transition = 'transform 0.3s ease';
  card.style.cursor = 'default';
  card.style.display = 'flex';
  card.style.alignItems = 'center';
  card.style.justifyContent = 'space-between';
  card.style.gap = '16px';
  card.style.height = '120px';

  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
  });

  card.innerHTML = `
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
      <div>
        <div style="font-weight:bold; color:#2a5298; font-size:15px; margin-bottom:4px; text-transform:uppercase;">
          ${member.name}
        </div>
        <div style="color:#555; font-size:13px; margin-bottom:6px; font-weight:500; text-transform:uppercase;">
          ${member.designation}
        </div>
      </div>
      <div style="font-size:11px; color:#777; background:rgba(255,255,255,0.5); padding:4px 10px; border-radius:5px; display:inline-block;">
        ${member.yearBranch}
      </div>
    </div>
    <div style="width:70px; height:90px; border:3px solid #FFFFFF; border-radius:8px; overflow:hidden; flex-shrink:0;">
      <img src="${member.img || 'images/default.jpg'}"
           alt="${member.name}"
           style="width:100%; height:100%; object-fit:cover;">
    </div>
  `;
  return card;
}


    function renderTeam(yearKey) {
        const team = teamData[yearKey];
        if (!team) return;

        teamTitle.textContent = `TEAM ${yearKey.toUpperCase()}`;
        teamGrid.innerHTML = '';

        // Core Team
        const coreSection = document.createElement('div');
        coreSection.innerHTML = `
            <div style="background-color: #2a5298; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">Core Team</div>
            <div id="coreGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;"></div>
        `;
        teamGrid.appendChild(coreSection);

        const coreGrid = coreSection.querySelector('#coreGrid');
        team.core.forEach(member => coreGrid.appendChild(createMemberCard(member)));

        // Exec Committee
        const execSection = document.createElement('div');
        execSection.innerHTML = `
            <div style="background-color: #1e3c72; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">Executive Committee</div>
            <div id="execGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;"></div>
        `;
        teamGrid.appendChild(execSection);

        const execGrid = execSection.querySelector('#execGrid');
        team.exec.forEach(member => execGrid.appendChild(createMemberCard(member)));
    }

    // Event listeners
    document.querySelectorAll('.year-card').forEach(card => {
        card.addEventListener('click', () => {
            const yearKey = card.getAttribute('data-year');
            teamDisplay.style.display = 'block';
            document.querySelector('.year-selector').style.display = 'none';
            renderTeam(yearKey);
        });
    });

    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            teamDisplay.style.display = 'none';
            document.querySelector('.year-selector').style.display = 'flex';
        });
    }
});

  function getTeamMemberByName(name, year = "2023-2024") {
    const yearData = teamData[year];
    if (!yearData) return null;
    
    // Search in core team
    let member = yearData.core.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (member) return { ...member, team: "core", year: year };
    
    // Search in execom team
    member = yearData.execom.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (member) return { ...member, team: "execom", year: year };
    
    return null;
  }

  function getAllTeamMembersByDesignation(designation) {
    const results = [];
    Object.keys(teamData).forEach(year => {
      const yearData = teamData[year];
      yearData.core.forEach(member => {
        if (member.designation.toLowerCase().includes(designation.toLowerCase())) {
          results.push({ ...member, team: "core", year: year });
        }
      });
      yearData.execom.forEach(member => {
        if (member.designation.toLowerCase().includes(designation.toLowerCase())) {
          results.push({ ...member, team: "execom", year: year });
        }
      });
    });
    return results;
  }

  function getTeamStats() {
    const stats = {};
    Object.keys(teamData).forEach(year => {
      const yearData = teamData[year];
      stats[year] = {
        coreCount: yearData.core.length,
        execomCount: yearData.execom.length,
        totalCount: yearData.core.length + yearData.execom.length
      };
    });
    return stats;
  }

  // Console helper functions for easy access
  console.log("Team Data Objects Loaded Successfully!");
  console.log("Available functions:");
  console.log("- getTeamMembersByYear('2023-2024')");
  console.log("- getTeamMemberByName('CHARITHA')");
  console.log("- getAllTeamMembersByDesignation('CHAIR-PERSON')");
  console.log("- getTeamStats()");
  console.log("- teamData (access full data object)");

  // ========== CHATBOT FUNCTIONALITY ==========
  // Initialize chat
  let chatbotHistory = [];
let hasNewChatbotMessage = false;
const welcomeText = document.getElementById('chatbotWelcomeText');

// Toggle chat panel
function toggleChatbot() {
  const panel = document.querySelector('.chatbot-panel');
  const btn = document.querySelector('.chatbot-btn');
  
  panel.classList.toggle('open');
  
  if (panel.classList.contains('open')) {
    // Remove notification when chat is opened
    btn.classList.remove('pulse');
    hasNewChatbotMessage = false;
    
    // Hide welcome text when chat opens
    welcomeText.classList.add('hidden');
    
    // Focus on input
    document.querySelector('.chatbot-input').focus();
  } else {
    // Show welcome text when chat closes
    welcomeText.classList.remove('hidden');
  }
}

// Event listeners for chat toggle
document.querySelector('.chatbot-btn').addEventListener('click', toggleChatbot);
document.querySelector('.chatbot-close').addEventListener('click', toggleChatbot);

// Add message to chat
function addChatbotMessage(role, text) {
  const messagesDiv = document.querySelector('.chatbot-messages');
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `chatbot-msg ${role}`;
  
  // Create avatar
  const avatar = document.createElement('div');
  avatar.className = 'chatbot-avatar';
  
  if (role === 'user') {
    avatar.innerHTML = '<i class="fas fa-user"></i>';
  } else {
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
  }
  
  // Create message content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'chatbot-msg-content';
  contentDiv.textContent = text;
  
  // Add timestamp
  const timeDiv = document.createElement('div');
  timeDiv.className = 'chatbot-msg-time';
  const now = new Date();
  timeDiv.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Append content and time
  const contentWrapper = document.createElement('div');
  contentWrapper.appendChild(contentDiv);
  contentWrapper.appendChild(timeDiv);
  
  // Arrange based on role
  if (role === 'user') {
    msgDiv.appendChild(contentWrapper);
    msgDiv.appendChild(avatar);
  } else {
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentWrapper);
  }
  
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  
  // Add to history
  chatbotHistory.push({ role, content: text });
  
  // Show notification for new assistant messages
  if (role === 'assistant' && !document.querySelector('.chatbot-panel').classList.contains('open')) {
    hasNewChatbotMessage = true;
    document.querySelector('.chatbot-btn').classList.add('pulse');
  }
}

// Send message function
async function sendChatbotMessage() {
  const input = document.querySelector('.chatbot-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  addChatbotMessage('user', message);
  input.value = '';
  
  // Show typing indicator
  document.querySelector('.chatbot-typing').style.display = 'flex';
  const sendBtn = document.querySelector('.chatbot-send-btn');
  sendBtn.disabled = true;
  
  try {
    // Call your API endpoint
    const response = await fetch('https://runtime.codewords.ai/run/iete_chatbot_76f6ef99', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer cwk-ac828e11f5f16f83ee14e2a398bee2993ff654d23c97ee98fb64065e45cc451e'
      },
      body: JSON.stringify({
        message: message,
        conversation_history: chatbotHistory.slice(0, -1)
      })
    });
    
    const data = await response.json();
    
    // Add assistant response
    setTimeout(() => {
      addChatbotMessage('assistant', data.response || "I'm here to help with IETE-related questions! For specific queries, email: ieteisfvbit2k25.26@gmail.com");
    }, 500);
    
  } catch (error) {
    console.error('Error:', error);
    setTimeout(() => {
      addChatbotMessage('assistant', "⚠️ Sorry, I'm having trouble connecting. Please try again or email us at ieteisfvbit2k25.26@gmail.com");
    }, 500);
  } finally {
    // Hide typing indicator
    setTimeout(() => {
      document.querySelector('.chatbot-typing').style.display = 'none';
      sendBtn.disabled = false;
      input.focus();
    }, 500);
  }
}

// Quick ask function for suggestions
function chatbotAsk(question) {
  document.querySelector('.chatbot-input').value = question;
  sendChatbotMessage();
}

// Event listeners
document.querySelector('.chatbot-send-btn').addEventListener('click', sendChatbotMessage);

document.querySelector('.chatbot-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    sendChatbotMessage();
  }
});

// Initial welcome message after a delay
setTimeout(() => {
  if (chatbotHistory.length === 0) {
    addChatbotMessage('assistant', "Welcome to IETE-ISF VBIT! I can help you with:\n• Event information 📅\n• Membership details 👥\n• Technical resources 📚\n• SOWPARNIKA details 🏆\n• Contact information 📞");
  }
}, 1000);

  // Show welcome text by default when page loads
  document.addEventListener('DOMContentLoaded', function() {
    welcomeText.classList.remove('hidden');
  });

  // ========== TOAST NOTIFICATION AND QUIZ POPUP FUNCTIONALITY ==========
  // Storage function for popup only
  function shouldShowPopup() {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('ietePopupShown');
    // Return true if they haven't seen it yet
    return !hasSeenPopup;
  }

  function markPopupAsShown() {
    // Mark that user has seen the popup
    localStorage.setItem('ietePopupShown', 'true');
    console.log("Popup marked as shown in localStorage");
  }

  document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded - Initializing toast and popup...");
    
    // ========== CONFIGURATION ==========
    const TIMING_CONFIG = {
        firstToastDelay: 15000,      // First toast at 15 seconds
        toastDuration: 5000,         // Toast stays for 5 seconds
        toastInterval: 50000,        // Interval between toasts
        firstPopupDelay: 5000,       // First popup at 5 seconds
        reminderDelay: 60000,        // Remind after 1 minute
        
        devMode: false,              // Set to true for testing
        devMultiplier: 0.1
    };
    
    // Apply dev mode if enabled
    if (TIMING_CONFIG.devMode) {
        console.warn("⚠️ DEV MODE ACTIVE");
        for (const key in TIMING_CONFIG) {
            if (typeof TIMING_CONFIG[key] === 'number' && key !== 'devMultiplier') {
                TIMING_CONFIG[key] = Math.floor(TIMING_CONFIG[key] * TIMING_CONFIG.devMultiplier);
            }
        }
    }
    
    // ========== ELEMENTS ==========
    const toast = document.getElementById('ieteToast');
    const toastClose = document.getElementById('toastClose');
    const quizPopup = document.getElementById('quizPopup');
    const popupClose = document.getElementById('popupClose');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const laterBtn = document.getElementById('laterBtn');
    
    // ========== STATE VARIABLES ==========
    let toastInterval = null;
    let isPopupOpen = false;
    let toastTimeout = null;
    let isToastVisible = false;
    let hasShownFirstToast = false;
    let hasShownFirstPopup = false;
    
    // ========== TOAST FUNCTIONS ==========
    function showToast(withProgress = true) {
        if (!toast || isToastVisible) return;
        
        // Remove existing progress bar
        const existingProgress = toast.querySelector('.iete-toast-progress');
        if (existingProgress) {
            existingProgress.remove();
        }
        
        // Add new progress bar
        if (withProgress) {
            const progressBar = document.createElement('div');
            progressBar.className = 'iete-toast-progress';
            progressBar.style.animation = `toastProgress ${TIMING_CONFIG.toastDuration}ms linear forwards`;
            toast.insertBefore(progressBar, toast.firstChild);
        }
        
        // Show toast
        toast.classList.add('show');
        isToastVisible = true;
        hasShownFirstToast = true;
        console.log("Toast shown");
        
        // Auto hide
        toastTimeout = setTimeout(() => {
            hideToast();
        }, TIMING_CONFIG.toastDuration);
    }
    
    function hideToast() {
        if (!toast || !isToastVisible) return;
        
        toast.classList.remove('show');
        isToastVisible = false;
        
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }
        
        console.log("Toast hidden");
    }
    
    // ========== POPUP FUNCTIONS ==========
    function showPopup() {
        if (!quizPopup || isPopupOpen) return;
        
        console.log("Showing quiz popup...");
        isPopupOpen = true;
        quizPopup.classList.add('show');
        hasShownFirstPopup = true;
        
        // Hide any visible toast
        hideToast();
    }
    
    function hidePopup() {
        if (!quizPopup || !isPopupOpen) return;
        
        console.log("Hiding quiz popup...");
        isPopupOpen = false;
        quizPopup.classList.remove('show');
    }
    
    // ========== EVENT LISTENERS ==========
    // Toast close button
    if (toastClose) {
        toastClose.addEventListener('click', (e) => {
            e.stopPropagation();
            hideToast();
        });
    }
    
    // Toast body click - only works when toast is visible
    if (toast) {
        toast.addEventListener('click', (e) => {
            // Only trigger if toast is visible AND click is not on close button
            if (isToastVisible && e.target !== toastClose && !toastClose.contains(e.target)) {
                console.log("Toast clicked - opening quiz popup");
                hideToast();
                // Only show popup if it hasn't been shown before
              markPopupAsShown();
            // Redirect to quiz page
            window.location.href = 'Quiz/main.html';
            }
        });
    }
    
    // Popup close button
    if (popupClose) {
        popupClose.addEventListener('click', (e) => {
            e.stopPropagation();
            hidePopup();
            // Mark popup as shown when closed
            markPopupAsShown();
        });
    }
    
    // Overlay click closes popup
    if (quizPopup) {
        quizPopup.addEventListener('click', (e) => {
            if (e.target === quizPopup || e.target.classList.contains('quiz-popup-overlay')) {
                hidePopup();
                // Mark popup as shown when closed
                markPopupAsShown();
            }
        });
    }
    
    // Start Quiz button
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            console.log("Starting quiz...");
            // Mark popup as shown before redirecting
            markPopupAsShown();
            hidePopup();
            window.location.href = 'Quiz/main.html';
        });
    }
    
    // Later button
    if (laterBtn) {
        laterBtn.addEventListener('click', () => {
            console.log("Remind me later...");
            // Mark popup as shown
            markPopupAsShown();
            hidePopup();
            
            // Show toast again after delay (toast will keep showing at intervals)
            setTimeout(() => {
                showToast(true);
            }, TIMING_CONFIG.reminderDelay);
        });
    }
    
    // ========== MODIFIED INITIALIZATION ==========
    console.log("Timing Configuration:", TIMING_CONFIG);
    console.log("Should show popup?", shouldShowPopup());
    
    // Show first popup - ONLY IF FIRST VISIT
    setTimeout(() => {
        if (shouldShowPopup()) {
            console.log(`Showing first popup after ${TIMING_CONFIG.firstPopupDelay}ms`);
            showPopup();
        } else {
            console.log("User has already seen popup - skipping");
        }
    }, TIMING_CONFIG.firstPopupDelay);
    
    // Show first toast after delay - TOAST SHOWS EVERY TIME
    setTimeout(() => {
        if (!isPopupOpen && !hasShownFirstToast) {
            console.log(`Showing first toast after ${TIMING_CONFIG.firstToastDelay}ms`);
            showToast(true);
        }
    }, TIMING_CONFIG.firstToastDelay);
    
    // Set up interval for additional toasts - TOAST KEEPS SHOWING AT INTERVALS
    toastInterval = setInterval(() => {
        if (!isPopupOpen && !isToastVisible) {
            console.log("Showing interval toast...");
            showToast(true);
        }
    }, TIMING_CONFIG.toastInterval + TIMING_CONFIG.toastDuration);
    
    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isPopupOpen) {
            hidePopup();
        }
        
        // R key resets popup storage for testing
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            localStorage.removeItem('ietePopupShown');
            console.log("Popup storage reset! Popup will show on next reload.");
            alert("Popup settings have been reset. Refresh the page to see the popup again.");
        }
    });
    
    // ========== PAGE VISIBILITY ==========
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log("Page hidden");
            hideToast();
        }
    });
    
    // ========== DEBUG INFO ==========
    console.log("Event handlers initialized successfully");
    console.log("Current localStorage state:");
    console.log("- ietePopupShown:", localStorage.getItem('ietePopupShown'));
  });

  // ========== INTERACTIVE GALLERY CAROUSEL ==========
  
  // Gallery data - images for each event category
  const galleryData = {
    sowparnika: {
      title: 'SOWPARNIKA',
      images: [
        'assets/img/sowparnika5.jpg',
        'assets/img/sowparnika2.jpg',
        'assets/img/sowparnika33.jpg',
        'sowp-2k23-1.jpg',
        'sowp-2k23-2.jpg',
        'sowp-2k23-3.jpg',
        'sowp-2k23-4.jpg',
        'sowparnika-2k21_1.jpg',
        'sowparnika-2k21_2.jpg',
        'sowparnika-2k21_3.jpg'
      ]
    },
    avyanna: {
      title: 'AVYANNA',
      images: [
        'assets/img/avyanna.jpg',
        'assets/img/AVYANA2.jpg',
        'assets/img/avyanna5.jpg'
      ]
    },
    cyberelite: {
      title: 'CYBER-ELITE',
      images: [
        'eventpic1.JPG',
        'eventpic2.JPG',
        'eventpic4.JPG'
      ]
    },
    genai: {
      title: 'GEN AI Spark',
      images: [
        'assets/img/ga.jpg',
        'assets/img/gen.jpg',
        'assets/img/genai 1 .jpg'
      ]
    }
  };

  // Open gallery carousel
  function openGalleryCarousel(category) {
    const modal = document.getElementById('galleryCarouselModal');
    const track = document.getElementById('galleryCarouselTrack');
    const title = document.getElementById('galleryCarouselTitle');
    
    if (!modal || !track || !galleryData[category]) return;
    
    // Set title
    title.textContent = galleryData[category].title;
    
    // Clear existing images
    track.innerHTML = '';
    
    // Get images for this category
    const images = galleryData[category].images;
    
    // Create images (duplicate for infinite scroll effect)
    const allImages = [...images, ...images]; // Duplicate for seamless loop
    
    allImages.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-carousel-item';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${galleryData[category].title} - Photo ${(index % images.length) + 1}`;
      img.loading = 'lazy';
      
      item.appendChild(img);
      track.appendChild(item);
    });
    
    // Calculate animation duration based on number of images
    const duration = images.length * 5; // 5 seconds per image
    track.style.animationDuration = `${duration}s`;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Trigger animation after a small delay for smooth transition
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }

  // Close gallery carousel
  function closeGalleryCarousel() {
    const modal = document.getElementById('galleryCarouselModal');
    
    if (!modal) return;
    
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
      
      // Clear images to free memory
      const track = document.getElementById('galleryCarouselTrack');
      if (track) track.innerHTML = '';
    }, 400);
  }

  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('galleryCarouselModal');
      if (modal && modal.classList.contains('active')) {
        closeGalleryCarousel();
      }
    }
  });

  // Close on clicking outside the carousel
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('galleryCarouselModal');
    if (modal && e.target === modal) {
      closeGalleryCarousel();
    }
  });

  console.log("Interactive Gallery Carousel Loaded Successfully!");


   // Add animation to year cards on page load
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.year-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        });