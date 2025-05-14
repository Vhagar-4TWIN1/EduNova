import{r as s,u as J,j as t,l as N,b as e,A as q,a as u}from"./index-C3nL3Q8Y.js";class p extends Error{}p.prototype.name="InvalidTokenError";function G(l){return decodeURIComponent(atob(l).replace(/(.)/g,(a,n)=>{let i=n.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function K(l){let a=l.replace(/-/g,"+").replace(/_/g,"/");switch(a.length%4){case 0:break;case 2:a+="==";break;case 3:a+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return G(a)}catch{return atob(a)}}function Q(l,a){if(typeof l!="string")throw new p("Invalid token specified: must be a string");a||(a={});const n=a.header===!0?0:1,i=l.split(".")[n];if(typeof i!="string")throw new p(`Invalid token specified: missing part #${n+1}`);let v;try{v=K(i)}catch(c){throw new p(`Invalid token specified: invalid base64 for part #${n+1} (${c.message})`)}try{return JSON.parse(v)}catch(c){throw new p(`Invalid token specified: invalid json for part #${n+1} (${c.message})`)}}const re=()=>{const[l,a]=s.useState([]),[n,i]=s.useState([]),[v,c]=s.useState(!0),[B,L]=s.useState(""),[D,C]=s.useState(null),[H,S]=s.useState(!1),[d,g]=s.useState(1),[x,F]=s.useState(""),b=9,f=J(),T=r=>{try{const o=u.get(`https://edunova-back-rqxc.onrender.com/module/${r._id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});console.log(o.data),console.log("the module is:",r)}catch(o){console.error("Error fetching module details:",o)}f(`/moduleDetails/${r._id}`)};s.useEffect(()=>{const r=localStorage.getItem("role");F(r||"student");const o=localStorage.getItem("token");Q(o).userId,(async()=>{var j,E;console.log("role: ",r);try{if(r=="Student"||r=="Admin"){const h=localStorage.getItem("email"),M=await(await fetch(`http://40.127.12.101/moodle/webservice/rest/server.php?wstoken=46b0837fde05083b10edd2f210c2fbe7&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=${h}&moodlewsrestformat=json`)).json(),$=((E=(j=M==null?void 0:M.users)==null?void 0:j[0])==null?void 0:E.id)||"-1";console.log($);const A=await(await fetch(`http://40.127.12.101/moodle/webservice/rest/server.php?wstoken=46b0837fde05083b10edd2f210c2fbe7&wsfunction=core_enrol_get_users_courses&userid=${$}&moodlewsrestformat=json`)).json();console.log(A);const R=await u.get("https://edunova-back-rqxc.onrender.com/module/",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}),V=A.map(w=>({_id:w.id,title:w.displayname||w.shortname,description:"Imported from Moodle",instructor:"Moodle Instructor",image:w.courseimage,source:"moodle"}));console.log("moodle modules",V);const z=[...R.data,...V];a(z),console.log("all modules",z),i(z),c(!1)}else{const h=await u.get("https://edunova-back-rqxc.onrender.com/module/modules/",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});a(h.data),i(h.data),c(!1)}}catch(h){console.error("Error fetching modules:",h),c(!1)}})()},[]);const Y=r=>{const o=r.target.value.toLowerCase();L(o),g(1);const m=l.filter(k=>k.title.toLowerCase().includes(o)||k.description.toLowerCase().includes(o));i(m)},I=d*b,P=I-b,_=n.slice(P,I),y=Math.ceil(n.length/b),U=async r=>{if(window.confirm("Are you sure you want to delete this module?"))try{await u.delete(`https://edunova-back-rqxc.onrender.com/module/${r}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}),a(o=>o.filter(m=>m._id!==r)),i(o=>o.filter(m=>m._id!==r)),alert("Module deleted successfully!")}catch(o){console.error("Error deleting module:",o),alert("Failed to delete module. Please try again.")}},O=r=>{C(r),S(!0)};return t(N,{children:[e("style",{jsx:!0,children:`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a0ca3;
          --primary-light: #4cc9f0;
          --accent: #f72585;
          --light: #f8f9fa;
          --light-gray: #e9ecef;
          --medium-gray: #adb5bd;
          --dark-gray: #495057;
          --dark: #212529;
          --white: #ffffff;
          --border-radius: 12px;
          --card-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .modules-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 2rem;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .action-icons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .action-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
          color: var(--medium-gray);
        }

        .action-icon:hover {
          background-color: var(--light-gray);
          color: var(--dark);
        }

        .action-icon.danger:hover {
          color: #ff3333;
        }

        .action-icon svg {
          width: 20px;
          height: 20px;
        }

        .modules-header {
          margin-bottom: 3rem;
        }

        .modules-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(
            90deg,
            var(--primary),
            var(--primary-dark)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modules-subtitle {
          font-size: 1.1rem;
          color: var(--medium-gray);
          margin: 0.5rem 0 0;
        }

        .modules-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .search-container {
          position: relative;
          flex-grow: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          font-size: 1rem;
          border: 2px solid var(--light-gray);
          border-radius: var(--border-radius);
          background-color: var(--white);
          transition: var(--transition);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-light);
          box-shadow: 0 0 0 4px rgba(70, 130, 180, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--medium-gray);
          pointer-events: none;
        }

        .add-module-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background-color: var(--primary);
          color: var(--white);
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 6px rgba(67, 97, 238, 0.3);
        }

        .add-module-button:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(67, 97, 238, 0.25);
        }

        .plus-icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* Force 3 columns */
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .module-card {
          background-color: var(--white);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: var(--transition);
        }

        .module-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        }

        .module-image-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio (change this to match your images' ratio) */
          overflow: hidden;
          cursor: pointer;
          background-color: #f5f5f5; /* Optional: background color for containers without images */
        }

        .module-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain; /* Changed from 'cover' to 'contain' to show full image */
          transition: transform 0.5s ease;
        }

        /* Optional: Add this if you want to maintain a minimum height */
        .module-card:hover .module-image {
          transform: scale(1.05);
        }

        .module-image-placeholder {
          width: 100%;
          height: 100%;
          background-color: var(--light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--medium-gray);
        }

        .module-image-placeholder svg {
          width: 48px;
          height: 48px;
          opacity: 0.5;
        }

        .module-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          color: var(--white);
          padding: 1rem;
          opacity: 0;
          transform: translateY(10px);
          transition: var(--transition);
        }

        .module-card:hover .module-card-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .module-card-content {
          padding: 1.5rem;
        }

        .module-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--dark);
        }

        .module-card-description {
          color: var(--dark-gray);
          margin: 0 0 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .module-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .moodle-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background-color: var(--light);
          color: var(--primary);
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .moodle-button:hover {
          background-color: var(--light-gray);
          color: var(--primary-dark);
        }

        .moodle-button svg {
          width: 16px;
          height: 16px;
        }

        .actions-menu {
          position: relative;
        }

        .actions-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: transparent;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
          color: var(--medium-gray);
        }

        .actions-toggle:hover {
          background-color: var(--light-gray);
          color: var(--dark);
        }

        .actions-toggle svg {
          width: 20px;
          height: 20px;
        }

        .actions-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          background-color: var(--white);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: var(--transition);
        }

        .actions-menu:hover .actions-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          text-align: left;
          color: var(--dark);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
        }

        .action-item:hover {
          background-color: var(--light);
          color: var(--primary);
        }

        .action-item.danger:hover {
          color: #ff3333;
        }

        .action-item svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
        }

        .empty-illustration {
          width: 150px;
          height: 150px;
          margin: 0 auto 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--medium-gray);
          margin-bottom: 1.5rem;
        }

        .empty-button {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary);
          color: var(--white);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .empty-button:hover {
          background-color: var(--primary-dark);
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 1.5rem;
        }

        .spinner-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid var(--light-gray);
          border-radius: 50%;
        }

        .spinner-path {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading p {
          color: var(--dark-gray);
          font-size: 1.1rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 3rem;
        }

        .pagination-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background-color: var(--white);
          color: var(--dark);
          border: 1px solid var(--light-gray);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .pagination-button:hover:not(.disabled) {
          background-color: var(--light);
          border-color: var(--medium-gray);
        }

        .pagination-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-button svg {
          width: 18px;
          height: 18px;
        }

        .page-numbers {
          display: flex;
          gap: 0.25rem;
        }

        .page-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--white);
          color: var(--dark);
          border: 1px solid var(--light-gray);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .page-number:hover {
          background-color: var(--light);
        }

        .page-number.active {
          background-color: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .modules-container {
            padding: 1.5rem;
          }

          .modules-title {
            font-size: 2rem;
          }

          .modules-grid {
            grid-template-columns: 1fr;
          }

          .modules-controls {
            flex-direction: column;
          }

          .search-container {
            min-width: 100%;
          }

          .add-module-button {
            width: 100%;
            justify-content: center;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .modules-container {
            padding: 1rem;
          }

          .modules-title {
            font-size: 1.75rem;
          }

          .pagination-button {
            padding: 0.5rem;
            font-size: 0.9rem;
          }

          .page-number {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }
        }
      `}),e("br",{}),t("div",{className:"modules-container",children:[t("header",{className:"modules-header",children:[e("h1",{className:"modules-title",children:"Modules & Moodle Courses"}),e("p",{className:"modules-subtitle",children:"Explore and manage your educational resources"}),t("div",{className:"modules-controls",children:[t("div",{className:"search-container",children:[e("svg",{className:"search-icon",viewBox:"0 0 24 24",children:e("path",{d:"M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})}),e("input",{type:"text",className:"search-input",placeholder:"Search modules...",value:B,onChange:Y})]}),x==="Teacher"||t("button",{className:"add-module-button",onClick:()=>f("/addModule"),children:[e("svg",{className:"plus-icon",viewBox:"0 0 24 24",children:e("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"})}),"Add Module"]})]})]}),H?e(q,{existingModule:D,onClose:async()=>{S(!1),C(null);try{const r=await u.get("https://edunova-back-rqxc.onrender.com/module/modules/",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});a(r.data),i(r.data),g(1)}catch(r){console.error("Error fetching updated modules:",r)}}}):v?t("div",{className:"loading",children:[t("div",{className:"loading-spinner",children:[e("div",{className:"spinner-circle"}),e("div",{className:"spinner-path"})]}),e("p",{children:"Loading modules..."})]}):t(N,{children:[e("div",{className:"modules-grid",children:_.length===0?t("div",{className:"empty-state",children:[e("div",{className:"empty-illustration",children:t("svg",{viewBox:"0 0 200 200",children:[e("path",{d:"M50 100C50 73.5 73.5 50 100 50s50 23.5 50 50-23.5 50-50 50S50 126.5 50 100z",fill:"#E1E8F8"}),e("path",{d:"M100 120c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20z",fill:"#4361EE"}),e("path",{d:"M100 110c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10z",fill:"#fff"}),e("path",{d:"M85 95a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM125 95a5 5 0 1 1-10 0 5 5 0 0 1 10 0z",fill:"#3A0CA3"}),e("path",{d:"M90 120c0 5.5 4.5 10 10 10s10-4.5 10-10h-4c0 3.3-2.7 6-6 6s-6-2.7-6-6h-4z",fill:"#3A0CA3"})]})}),e("h3",{children:"No modules found"}),e("p",{children:"Try adjusting your search or create a new module"}),x==="Teacher"||e("button",{className:"empty-button",onClick:()=>f("/addModule"),children:"Create Your First Module"})]}):_.map(r=>t("div",{className:"module-card",children:[t("div",{className:"module-image-container",onClick:()=>T(r),children:[r.image?e("img",{src:r.image,alt:r.title,className:"module-image"}):e("div",{className:"module-image-placeholder",children:e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"})})}),e("div",{className:"module-card-overlay"})]}),t("div",{className:"module-card-content",children:[e("h3",{className:"module-card-title",children:r.title}),e("p",{className:"module-card-description",children:r.description}),e("div",{className:"module-card-footer",children:r.source==="moodle"?t("button",{className:"moodle-button",onClick:()=>window.open(r._id,"_blank"),children:[e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"})}),"View on Moodle"]}):t("div",{className:"actions-menu",children:[e("button",{className:"actions-toggle"}),e("div",{className:"module-actions",children:r.source==="moodle"?t("button",{className:"moodle-button",onClick:()=>window.open(r._id,"_blank"),children:[e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"})}),"View on Moodle"]}):t("div",{className:"action-icons",children:[e("button",{className:"action-icon",onClick:o=>{o.preventDefault(),f(`/moduleDetails/${r._id}`)},title:"View Details",children:e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"})})}),x==="Teacher"||t(N,{children:[e("button",{className:"action-icon",onClick:o=>{o.preventDefault(),O(r)},title:"Edit Module",children:e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"})})}),e("button",{className:"action-icon danger",onClick:o=>{o.preventDefault(),U(r._id)},title:"Delete Module",children:e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"})})})]})]})})]})})]})]},r._id))}),n.length>b&&t("div",{className:"pagination",children:[t("button",{className:`pagination-button ${d===1?"disabled":""}`,onClick:()=>g(d-1),disabled:d===1,children:[e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"})}),"Previous"]}),e("div",{className:"page-numbers",children:Array.from({length:y},(r,o)=>o+1).map(r=>e("button",{className:`page-number ${d===r?"active":""}`,onClick:()=>g(r),children:r},r))}),t("button",{className:`pagination-button ${d===y?"disabled":""}`,onClick:()=>g(d+1),disabled:d===y,children:["Next",e("svg",{viewBox:"0 0 24 24",children:e("path",{d:"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"})})]})]})]})]})]})};export{re as default};
