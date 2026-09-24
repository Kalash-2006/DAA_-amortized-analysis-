document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SCROLL PROGRESS & NAVBAR STICKY/ACTIVE STATES
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    // Scroll progress bar width
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';

    // Active navigation item highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     2. DYNAMIC ARRAY INTERACTIVE SIMULATION
     ========================================================================== */
  let capacity = 4;
  let count = 0;
  let totalCost = 0;
  let arrayData = [];

  const btnInsert = document.getElementById('btn-insert');
  const btnReset = document.getElementById('btn-reset');
  const arrayContainer = document.getElementById('array-container');
  const statOps = document.getElementById('stat-ops');
  const statCost = document.getElementById('stat-cost');
  const statAmortized = document.getElementById('stat-amortized');
  const statCapacity = document.getElementById('stat-capacity');
  const visStatus = document.getElementById('vis-status');
  const historyBody = document.getElementById('history-body');

  // Initialize display
  renderArray();

  btnInsert.addEventListener('click', () => {
    count++;
    let currentCost = 1; // Default element insertion cost
    let isResize = false;
    let oldCap = capacity;

    // Check if dynamic array is full
    if (count > capacity) {
      isResize = true;
      const copyCost = arrayData.length;
      currentCost = copyCost + 1; // Resizing cost = copies + 1 insert
      capacity *= 2; // Capacity doubling rule
    }

    totalCost += currentCost;
    arrayData.push(count);

    // Update UI Stats
    statOps.textContent = count;
    statCost.textContent = totalCost;
    statAmortized.textContent = (totalCost / count).toFixed(2);
    statCapacity.textContent = capacity;

    // Render Status and Visual updates
    if (isResize) {
      visStatus.className = 'vis-status resize-alert';
      visStatus.textContent = `ARRAY RESIZING TRIGGERED! Capacity expanded: ${oldCap} ➔ ${capacity}. Cost: ${currentCost} (${arrayData.length - 1} copies + 1 insertion).`;
    } else {
      visStatus.className = 'vis-status';
      visStatus.textContent = `Inserted element '${count}'. Normal Insertion Cost: 1.`;
    }

    renderArray(isResize);
    logHistory(count, currentCost, isResize ? `Array resized (${oldCap}➔${capacity}) + Insert` : 'Normal insertion', capacity);
  });

  btnReset.addEventListener('click', () => {
    capacity = 4;
    count = 0;
    totalCost = 0;
    arrayData = [];

    statOps.textContent = '0';
    statCost.textContent = '0';
    statAmortized.textContent = '0.00';
    statCapacity.textContent = '4';

    visStatus.className = 'vis-status';
    visStatus.textContent = 'Simulation reset. Initial Capacity: 4';
    historyBody.innerHTML = '';

    renderArray();
  });

  function renderArray(highlightResize = false) {
    arrayContainer.innerHTML = '';
    for (let i = 0; i < capacity; i++) {
      const cell = document.createElement('div');
      cell.className = 'array-cell';

      const idxTag = document.createElement('span');
      idxTag.className = 'cell-index';
      idxTag.textContent = `[${i}]`;
      cell.appendChild(idxTag);

      if (i < arrayData.length) {
        cell.classList.add('filled');
        if (highlightResize && i < arrayData.length - 1) {
          cell.classList.add('copied');
        }
        cell.appendChild(document.createTextNode(arrayData[i]));
      } else {
        cell.appendChild(document.createTextNode('-'));
      }

      arrayContainer.appendChild(cell);
    }
  }

  function logHistory(op, cost, reason, cap) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${op}</td>
      <td><strong>${cost}</strong></td>
      <td>${reason}</td>
      <td>${cap}</td>
    `;
    historyBody.insertBefore(tr, historyBody.firstChild);
  }

  /* ==========================================================================
     3. AMORTIZED COST CALCULATOR
     ========================================================================== */
  const btnCalculate = document.getElementById('btn-calculate');
  const inputOps = document.getElementById('num-ops');
  const inputCost = document.getElementById('total-cost');
  const calcResult = document.getElementById('calc-result');
  const resVal = document.getElementById('res-val');

  btnCalculate.addEventListener('click', () => {
    const ops = parseFloat(inputOps.value);
    const cost = parseFloat(inputCost.value);

    // Input Validation
    if (isNaN(ops) || isNaN(cost) || ops <= 0 || cost < 0) {
      alert('Please enter valid non-zero positive numbers.');
      return;
    }

    const amortized = (cost / ops).toFixed(2);
    resVal.textContent = amortized;
    calcResult.classList.remove('hidden');
  });

  /* ==========================================================================
     4. METHOD MODAL POPUP SYSTEM
     ========================================================================== */
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');

  const modalDetails = {
    aggregate: `
      <h3 style="color: #0b132b; margin-bottom: 10px;">Aggregate Method Details</h3>
      <p style="color: #64748b; margin-bottom: 15px;">
        In the aggregate method, we show that for all <em>n</em>, a sequence of <em>n</em> operations takes total time <em>T(n)</em> in the worst case. The average cost (amortized cost) per operation is then simply <strong>T(n) / n</strong>.
      </p>
      <div style="background: #f1f3f5; padding: 15px; border-radius: 6px; font-size: 0.9rem;">
        <strong>Key Feature:</strong> All operations are assigned the same equal amortized cost, regardless of whether individual operations are cheap or expensive.
      </div>
    `,
    accounting: `
      <h3 style="color: #0b132b; margin-bottom: 10px;">Accounting Method Details</h3>
      <p style="color: #64748b; margin-bottom: 15px;">
        In the accounting method, we assign different charges to different operations. Some operations are charged more than their actual cost; the excess credit is saved in a bank account for future expensive steps.
      </p>
      <div style="background: #f1f3f5; padding: 15px; border-radius: 6px; font-size: 0.9rem;">
        <strong>Condition:</strong> The total accumulated credit in the bank account must remain non-negative ($\ge 0$) at all times during the execution sequence.
      </div>
    `,
    potential: `
      <h3 style="color: #0b132b; margin-bottom: 10px;">Potential Method Details</h3>
      <p style="color: #64748b; margin-bottom: 15px;">
        The potential method represents saved work as "potential energy" $\Phi(D)$ associated with the entire data structure $D$. An expensive operation releases stored potential energy to compensate for high costs.
      </p>
      <div style="background: #f1f3f5; padding: 15px; border-radius: 6px; font-size: 0.9rem;">
        <strong>Formula:</strong> $\hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1})$<br>
        Where $\hat{c}_i$ is the amortized cost and $c_i$ is the actual cost.
      </div>
    `
  };

  window.openModal = function(methodKey) {
    if (modalDetails[methodKey]) {
      modalContent.innerHTML = modalDetails[methodKey];
      modalBackdrop.classList.add('active');
    }
  };

  window.closeModal = function() {
    modalBackdrop.classList.remove('active');
  };

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

});