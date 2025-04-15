document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // DOM elements
  const branchSelect = document.getElementById("branch");
  const yearSelect = document.getElementById("year");
  const semesterSelect = document.getElementById("semester");
  const viewSubjectsBtn = document.getElementById("viewSubjectsBtn");
  const subjectSelectionForm = document.getElementById("subjectSelectionForm");
  const subjectsContainer = document.getElementById("subjectsContainer");
  const subjectsGrid = document.getElementById("subjectsGrid");

  // Populate branch select
  populateBranches();

  // Event listeners
  branchSelect.addEventListener("change", handleBranchChange);
  yearSelect.addEventListener("change", handleYearChange);
  semesterSelect.addEventListener("change", handleSemesterChange);
  subjectSelectionForm.addEventListener("submit", handleFormSubmit);

  // Populate branches in select dropdown
  function populateBranches() {
    const branches = getBranches();
    branches.forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch;
      option.textContent = branch;
      branchSelect.appendChild(option);
    });
  }

  // Handle branch selection
  function handleBranchChange() {
    const branch = branchSelect.value;

    // Reset year and semester selects
    yearSelect.innerHTML =
      '<option value="" disabled selected>Select your year</option>';
    semesterSelect.innerHTML =
      '<option value="" disabled selected>Select your semester</option>';
    semesterSelect.disabled = true;
    viewSubjectsBtn.disabled = true;

    if (branch) {
      // Enable year select
      yearSelect.disabled = false;

      // Populate years for selected branch
      const years = getYears(branch);
      years.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = `Year ${year}`;
        yearSelect.appendChild(option);
      });
    } else {
      yearSelect.disabled = true;
    }
  }

  // Handle year selection
  function handleYearChange() {
    const branch = branchSelect.value;
    const year = parseInt(yearSelect.value, 10);

    // Reset semester select
    semesterSelect.innerHTML =
      '<option value="" disabled selected>Select your semester</option>';
    viewSubjectsBtn.disabled = true;

    if (year) {
      // Enable semester select
      semesterSelect.disabled = false;

      // Populate semesters for selected branch and year
      const semesters = getSemesters(branch, year);
      semesters.forEach((semester) => {
        const option = document.createElement("option");
        option.value = semester;
        option.textContent = `Semester ${semester}`;
        semesterSelect.appendChild(option);
      });
    } else {
      semesterSelect.disabled = true;
    }
  }

  // Handle semester selection
  function handleSemesterChange() {
    viewSubjectsBtn.disabled = !semesterSelect.value;
  }

  // Handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    const branch = branchSelect.value;
    const year = parseInt(yearSelect.value, 10);
    const semester = parseInt(semesterSelect.value, 10);

    if (branch && year && semester) {
      displaySubjects(branch, year, semester);
    }
  }

  // Display subjects based on selection
  function displaySubjects(branch, year, semester) {
    const subjects = getSubjects(branch, year, semester);

    // Clear previous subjects
    subjectsGrid.innerHTML = "";

    if (subjects.length > 0) {
      // Show subjects container
      subjectsContainer.style.display = "block";

      // Create subject cards
      subjects.forEach((subject) => {
        const card = createSubjectCard(subject);
        subjectsGrid.appendChild(card);
      });

      // Scroll to subjects
      subjectsContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      subjectsContainer.style.display = "none";
      alert("No subjects found for the selected criteria.");
    }
  }

  // Create a subject card
  function createSubjectCard(subject) {
    const card = document.createElement("div");
    card.className = "subject-card";
    card.id = `subject-${subject.id}`;

    // Card header with subject title and toggle button
    const cardHeader = document.createElement("div");
    cardHeader.className = "subject-card-header";

    const titleWrapper = document.createElement("div");
    titleWrapper.innerHTML = `
        <div class="subject-title-wrapper">
          <i data-lucide="book-marked"></i>
          <h3 class="subject-title">${subject.name}</h3>
        </div>
        <span class="subject-code">${subject.code}</span>
      `;

    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle-button";
    toggleButton.innerHTML = '<i data-lucide="chevron-down"></i>';
    toggleButton.setAttribute("aria-label", "Toggle subject details");

    cardHeader.appendChild(titleWrapper);
    cardHeader.appendChild(toggleButton);

    // Card content
    const cardContent = document.createElement("div");
    cardContent.className = "subject-card-content";

    // Teacher information
    const teacherInfo = document.createElement("div");
    teacherInfo.className = "teacher-info";
    teacherInfo.innerHTML = `
        <i data-lucide="user"></i>
        <span class="teacher-name">${subject.teacher}</span>
      `;

    // Subject details (hidden by default)
    const subjectDetails = document.createElement("div");
    subjectDetails.className = "subject-details";

    // Syllabus section
    const syllabusSection = document.createElement("div");
    syllabusSection.className = "subject-details-section";
    syllabusSection.innerHTML = `
        <h4 class="subject-details-title">
          <i data-lucide="file-text"></i>
          Syllabus
        </h4>
        <ul class="syllabus-list">
          ${subject.syllabus.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `;

    // Resources section
    const resourcesSection = document.createElement("div");
    resourcesSection.className = "subject-details-section";
    resourcesSection.innerHTML = `
        <h4 class="subject-details-title">
          <i data-lucide="book-open"></i>
          Resources
        </h4>
        <ul class="resources-list">
          ${subject.resources
            .map(
              (resource) => `
            <li>
              <i data-lucide="link"></i>
              <a href="${resource.link}" target="_blank" rel="noopener noreferrer">${resource.title}</a>
            </li>
          `
            )
            .join("")}
        </ul>
      `;

    subjectDetails.appendChild(syllabusSection);
    subjectDetails.appendChild(resourcesSection);

    cardContent.appendChild(teacherInfo);
    cardContent.appendChild(subjectDetails);

    // Add all elements to card
    card.appendChild(cardHeader);
    card.appendChild(cardContent);

    // Toggle details on button click
    toggleButton.addEventListener("click", function () {
      const detailsVisible = subjectDetails.style.display === "block";
      subjectDetails.style.display = detailsVisible ? "none" : "block";
      toggleButton.innerHTML = detailsVisible
        ? '<i data-lucide="chevron-down"></i>'
        : '<i data-lucide="chevron-up"></i>';
      lucide.createIcons();
    });

    // Initialize Lucide icons in the card
    setTimeout(
      () => lucide.createIcons({ attrs: { class: "lucide-icon" } }),
      0
    );

    return card;
  }
});
