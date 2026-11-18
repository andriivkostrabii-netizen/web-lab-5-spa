'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // === 1. Ініціалізація State Monitor (Секундомір сесії) ===
  const timerDisplay = document.getElementById('session-timer');
  let elapsedSeconds = 0;

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  window.setInterval(() => {
    elapsedSeconds += 1;
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }
  }, 1000);

  // === 2. Клієнтська маршрутизація (SPA Navigation) ===
  const navContainer = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');

  /**
   * Перемикає активну секцію та оновлює стан навігаційного меню
   * @param {string} targetId - ID цільової секції
   */
  const navigateToSection = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Приховуємо всі секції, показуємо лише обрану
    sections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.remove('is-hidden');
      } else {
        section.classList.add('is-hidden');
      }
    });

    // Оновлюємо активний клас у навігації
    navLinks.forEach((link) => {
      if (link.dataset.target === targetId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  };

  // Підхід Б: Делегування кліків на навігаційному контейнері
  if (navContainer) {
    navContainer.addEventListener('click', (event) => {
      const link = event.target.closest('.nav-link');
      if (!link) return;

      event.preventDefault(); // Запобігаємо стандартному переходу / стрибку сторінки
      const targetId = link.dataset.target;

      // Оновлюємо хеш в адресному рядку без перезавантаження
      window.history.pushState(null, '', `#${targetId}`);
      navigateToSection(targetId);
    });
  }

  // Підхід А: Підтримка навігації браузера (кнопки Назад/Вперед та пряме відкриття URL з хешем)
  const handleHashChange = () => {
    const hashId = window.location.hash.replace('#', '');
    if (hashId) {
      navigateToSection(hashId);
    } else {
      navigateToSection('catalog');
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  // Перевірка початкового хешу при завантаженні сторінки
  if (window.location.hash) {
    handleHashChange();
  }

  // === 3. Обробка демонстраційної форми без перезавантаження ===
  const feedbackForm = document.getElementById('feedback-form');
  const formStatus = document.getElementById('form-status');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameInput = document.getElementById('user-name');
      formStatus.textContent = `Дякуємо, ${nameInput.value}! Повідомлення успішно оброблено на клієнті.`;
      feedbackForm.reset();
    });
  }
});
