const seed = {
 students:[
  {id:1,name:"Aarav Mehta",email:"aarav@example.com",course:"BCA",cgpa:8.2,backlogs:0,phone:"9876543210"},
  {id:2,name:"Priya Singh",email:"priya@example.com",course:"B.Tech CSE",cgpa:7.8,backlogs:0,phone:"9876543211"},
  {id:3,name:"Kabir Verma",email:"kabir@example.com",course:"BBA",cgpa:6.4,backlogs:1,phone:"9876543212"},
  {id:4,name:"Neha Sharma",email:"neha@example.com",course:"BCA",cgpa:8.7,backlogs:0,phone:"9876543213"}
 ],
 companies:[
  {id:1,name:"TechNova Solutions",industry:"IT Services",contact:"Ritika Jain",email:"careers@technova.example"},
  {id:2,name:"BrightPath Analytics",industry:"Data & Analytics",contact:"Amit Rao",email:"hr@brightpath.example"},
  {id:3,name:"CloudPeak Systems",industry:"Cloud Technology",contact:"Sana Khan",email:"jobs@cloudpeak.example"}
 ],
 jobs:[
  {id:1,title:"Graduate Software Trainee",company:"TechNova Solutions",package:4.2,deadline:"2026-12-10",minCgpa:6,course:"BCA"},
  {id:2,title:"Junior Data Analyst",company:"BrightPath Analytics",package:5.0,deadline:"2026-12-15",minCgpa:6.5,course:"BCA"},
  {id:3,title:"Cloud Support Associate",company:"CloudPeak Systems",package:3.8,deadline:"2026-12-20",minCgpa:6,course:"Any"}
 ],
 applications:[
  {id:1,student:1,job:1,status:"Shortlisted",date:"2026-11-18"},
  {id:2,student:2,job:2,status:"Applied",date:"2026-11-19"},
  {id:3,student:4,job:1,status:"Selected",date:"2026-11-20"}
 ]
};
let db = JSON.parse(localStorage.getItem("placepro_db") || "null") || seed;
function save(){localStorage.setItem("placepro_db",JSON.stringify(db));renderAll()}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function initials(s){return (s||"?").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function student(id){return db.students.find(x=>x.id==id)}
function job(id){return db.jobs.find(x=>x.id==id)}
function statusPill(s){let cls=s==="Selected"?"green":s==="Rejected"?"red":s==="Shortlisted"?"orange":"";return `<span class="pill ${cls}">${esc(s)}</span>`}
function showPage(name){document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));document.getElementById(name+"Page").classList.remove("hidden");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===name));document.getElementById("pageTitle").textContent=name[0].toUpperCase()+name.slice(1);document.getElementById("sidebar").classList.remove("open");renderAll()}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
function openModal(id){refreshSelects();document.getElementById(id).classList.add("open")}
function closeModal(id){document.getElementById(id).classList.remove("open")}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function renderDashboard(){
 document.getElementById("statStudents").textContent=db.students.length;document.getElementById("statCompanies").textContent=db.companies.length;document.getElementById("statJobs").textContent=db.jobs.length;document.getElementById("statApplications").textContent=db.applications.length;
 document.getElementById("recentApplications").innerHTML=db.applications.slice().reverse().slice(0,4).map(a=>{let s=student(a.student),j=job(a.job);return `<tr><td><div class="person"><div class="mini-avatar">${initials(s?.name)}</div><div><b>${esc(s?.name||"Unknown")}</b><small>${esc(s?.course||"")}</small></div></div></td><td>${esc(j?.title||"Removed job")}</td><td>${statusPill(a.status)}</td></tr>`}).join("")||'<tr><td colspan="3">No applications yet.</td></tr>';
 document.getElementById("upcomingJobs").innerHTML=db.jobs.slice(0,4).map(j=>{let d=new Date(j.deadline+"T00:00:00");return `<div class="upcoming-item"><div class="date-box"><b>${isNaN(d)? "—":d.getDate()}</b>${isNaN(d)? "":d.toLocaleString("en",{month:"short"}).toUpperCase()}</div><div><b>${esc(j.title)}</b><small>${esc(j.company)} · ${j.package} LPA</small></div></div>`}).join("")||'<p class="muted">No job drives added.</p>';
}
function renderStudents(){let q=(document.getElementById("studentSearch")?.value||"").toLowerCase(),arr=db.students.filter(s=>(s.name+s.email+s.course).toLowerCase().includes(q));document.getElementById("studentCount").textContent=arr.length+" students";document.getElementById("studentsTable").innerHTML=arr.map(s=>`<tr><td><div class="person"><div class="mini-avatar">${initials(s.name)}</div><div><b>${esc(s.name)}</b><small>${esc(s.email)}</small></div></div></td><td>${esc(s.course)}</td><td>${Number(s.cgpa).toFixed(2)}</td><td>${s.backlogs}</td><td>${s.cgpa>=6&&s.backlogs==0?'<span class="pill green">Eligible</span>':'<span class="pill orange">Review</span>'}</td><td><button class="text-btn" onclick="deleteItem('students',${s.id})">Delete</button></td></tr>`).join("")||'<tr><td colspan="6">No students found.</td></tr>'}
function renderCompanies(){document.getElementById("companyGrid").innerHTML=db.companies.map(c=>`<article class="company-card"><div class="company-logo">${initials(c.name)}</div><h3>${esc(c.name)}</h3><p>${esc(c.industry)}</p><small>HR: ${esc(c.contact||"Not provided")}<br>${esc(c.email||"No email added")}</small><div style="margin-top:15px"><button class="text-btn" onclick="deleteItem('companies',${c.id})">Remove company</button></div></article>`).join("")||'<p class="muted">No companies added yet.</p>'}
function renderJobs(){let q=(document.getElementById("jobSearch")?.value||"").toLowerCase(),arr=db.jobs.filter(j=>(j.title+j.company).toLowerCase().includes(q));document.getElementById("jobsTable").innerHTML=arr.map(j=>`<tr><td><b>${esc(j.title)}</b><br><small class="muted">Min CGPA ${j.minCgpa} · ${esc(j.course||"Any course")}</small></td><td>${esc(j.company)}</td><td>${j.package} LPA</td><td>${esc(j.deadline)}</td><td>${new Date(j.deadline+"T23:59:59")>=new Date()?'<span class="pill green">Open</span>':'<span class="pill red">Closed</span>'}</td></tr>`).join("")||'<tr><td colspan="5">No job drives found.</td></tr>'}
function renderApplications(){let q=(document.getElementById("appSearch")?.value||"").toLowerCase(),st=document.getElementById("statusFilter")?.value||"",arr=db.applications.filter(a=>{let s=student(a.student),j=job(a.job);return ((s?.name||"")+(j?.title||"")+(j?.company||"")).toLowerCase().includes(q)&&(!st||a.status===st)});document.getElementById("applicationsTable").innerHTML=arr.map(a=>{let s=student(a.student),j=job(a.job);return `<tr><td>${esc(s?.name||"Unknown")}</td><td>${esc(j?.title||"Removed job")}</td><td>${esc(j?.company||"—")}</td><td>${esc(a.date)}</td><td>${statusPill(a.status)}</td><td><select class="action-select" onchange="updateStatus(${a.id},this.value)"><option ${a.status==="Applied"?"selected":""}>Applied</option><option ${a.status==="Shortlisted"?"selected":""}>Shortlisted</option><option ${a.status==="Selected"?"selected":""}>Selected</option><option ${a.status==="Rejected"?"selected":""}>Rejected</option></select></td></tr>`}).join("")||'<tr><td colspan="6">No applications found.</td></tr>'}
function updateStatus(id,status){let a=db.applications.find(x=>x.id===id);if(a){a.status=status;save();toast("Application status updated")}}
function deleteItem(type,id){if(!confirm("Are you sure you want to delete this record?"))return;db[type]=db[type].filter(x=>x.id!==id);if(type==="students")db.applications=db.applications.filter(a=>a.student!==id);if(type==="jobs")db.applications=db.applications.filter(a=>a.job!==id);save();toast("Record deleted")}
function refreshSelects(){document.getElementById("jobCompany").innerHTML=db.companies.map(c=>`<option>${esc(c.name)}</option>`).join("");document.getElementById("appStudent").innerHTML=db.students.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");document.getElementById("appJob").innerHTML=db.jobs.map(j=>`<option value="${j.id}">${esc(j.title)} — ${esc(j.company)}</option>`).join("")}
function nextId(arr){return Math.max(0,...arr.map(x=>x.id))+1}
function formData(form){return Object.fromEntries(new FormData(form).entries())}
document.getElementById("studentForm").onsubmit=e=>{e.preventDefault();let x=formData(e.target);db.students.push({...x,id:nextId(db.students),cgpa:Number(x.cgpa),backlogs:Number(x.backlogs)});e.target.reset();closeModal("studentModal");save();toast("Student added successfully")};
document.getElementById("companyForm").onsubmit=e=>{e.preventDefault();db.companies.push({...formData(e.target),id:nextId(db.companies)});e.target.reset();closeModal("companyModal");save();toast("Company added successfully")};
document.getElementById("jobForm").onsubmit=e=>{e.preventDefault();let x=formData(e.target);db.jobs.push({...x,id:nextId(db.jobs),package:Number(x.package),minCgpa:Number(x.minCgpa)});e.target.reset();closeModal("jobModal");save();toast("Job drive published")};
document.getElementById("applicationForm").onsubmit=e=>{e.preventDefault();let x=formData(e.target);let s=student(x.student),j=job(x.job);if(!s||!j){toast("Please add a student and job first");return}if(s.cgpa<j.minCgpa||s.backlogs>0){if(!confirm("This student may not meet the job eligibility criteria. Add application anyway?"))return}db.applications.push({id:nextId(db.applications),student:Number(x.student),job:Number(x.job),status:x.status,date:new Date().toISOString().slice(0,10)});e.target.reset();closeModal("applicationModal");save();toast("Application recorded")};
function renderAll(){renderDashboard();renderStudents();renderCompanies();renderJobs();renderApplications();refreshSelects()}
renderAll();
