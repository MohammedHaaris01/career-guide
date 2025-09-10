<img width="1897" height="937" alt="image" src="https://github.com/user-attachments/assets/8344b4cf-c189-4b83-bcd2-6bfdc7b91f82" />
<img width="1915" height="957" alt="image" src="https://github.com/user-attachments/assets/0e19b2c1-8de6-4036-abba-6f2ab11497a2" />

# 🎓 Career Guide – MERN Stack Project

An interactive **Career & Education Advisor** web application built with the **MERN stack**.  
This project helps students explore their **career opportunities, colleges, and scholarships** based on their background and interests.

---

## 🚀 Features
- 👤 **Student Onboarding Flow**: Start with student name, qualification (10th/12th), and stream selection.
- 🏫 **Dynamic Pathways**: 
  - If 10th → choose between 12th or Diploma.
  - If 12th → choose stream (Science, Commerce, Arts, etc.).
  - If Diploma → explore available streams.
- 📍 **Location Based College Search**: Suggests colleges in the student’s district based on chosen stream.
- 💰 **Scholarship Guidance**: Calculates scholarships based on community, income, and first graduate status.
- 📝 **Counselling Reminders**: Sends alerts before TNEA and other official counselling registrations.
- 📚 **Stream & Course Mapping**: Maps interests to possible careers (Engineering, Medical, Law, Fine Arts, etc.).

---

## 🛠️ Tech Stack
- **Frontend**: React.js + Tailwind CSS  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Hosting**: Vercel (frontend) & Render (backend)  
- **Task Scheduling**: Cron jobs for counselling reminders  

---

## 📖 Project Flow
The app follows this simple questionnaire logic:contentReference[oaicite:2]{index=2}:

1. Ask for **student name**  
2. Ask if they completed **10th or 12th**  
   - If **10th** → Ask for **12th or Diploma**  
   - If **12th** → Ask for **Stream (Science, Commerce, Arts, etc.)**  
   - If **Diploma** → Show **available streams**  
3. Ask for **district** → show colleges offering chosen stream  
4. Ask for **scholarship criteria** → community, income, first graduate → show eligible schemes  
5. Show **counselling portal (e.g., TNEA)** and set reminders  

---

## 🗺️ Future Roadmap
Based on the career mapping:contentReference[oaicite:3]{index=3}:
- **Engineering**: CSE, Mech, Civil, ECE, IT, AI/DS, Chemical, etc.
- **Medical**: MBBS, BDS, AYUSH, Pharmacy, Physiotherapy, Lab Tech, etc.
- **Science**: B.Sc (Zoology, Botany, Microbiology, Nutrition, etc.)
- **Commerce & Arts**: B.A, Law, Fine Arts, Political Science, Journalism, etc.
- **Diploma Pathways** for technical streams.

---

## 🤝 Collaboration
- Main Branch: `main`  
- Contributions via Pull Requests  
- Add new features in separate branches  

---

## 📬 Contact
👤 Developed by **Mohammed Haaris**  
📧 Email: *mohammedhaaris1405@gmail.com*  
🔗 GitHub: [MohammedHaaris01](https://github.com/MohammedHaaris01)

---

