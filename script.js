/* ===================================
   SCRIPT.JS — Dr. Arash Falahat
   فوق تخصص قلب و عروق | ارومیه
=================================== */

'use strict';

// ===== NAVBAR SCROLL EFFECT =====
const header = document.querySelector('.header');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // بستن منو با کلیک روی لینک‌ها
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // بستن منو با کلیک خارج از منو
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORM VALIDATION & SUBMISSION =====
const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
    const formInputs = {
        name: appointmentForm.querySelector('[name="name"]'),
        phone: appointmentForm.querySelector('[name="phone"]'),
        date: appointmentForm.querySelector('[name="date"]'),
        time: appointmentForm.querySelector('[name="time"]')
    };

    // تنظیم حداقل تاریخ به امروز
    if (formInputs.date) {
        const today = new Date().toISOString().split('T')[0];
        formInputs.date.setAttribute('min', today);
    }

    // فقط اعداد انگلیسی برای تلفن
    if (formInputs.phone) {
        formInputs.phone.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        });
    }

    // ولیدیشن هر فیلد
    const validateField = (field) => {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // حذف کلاس error قبلی
        field.classList.remove('error');
        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = '';

        // چک خالی بودن
        if (!value) {
            isValid = false;
            errorMessage = 'این فیلد الزامی است';
        } 
        // چک نام (حداقل 3 کاراکتر)
        else if (fieldName === 'name' && value.length < 3) {
            isValid = false;
            errorMessage = 'نام باید حداقل ۳ حرف باشد';
        }
        // چک شماره تلفن (11 رقم)
        else if (fieldName === 'phone') {
            const phoneRegex = /^09\d{9}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
            }
        }
        // چک تاریخ
        else if (fieldName === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'تاریخ نمی‌تواند قبل از امروز باشد';
            }
        }

        // نمایش خطا
        if (!isValid) {
            field.classList.add('error');
            if (errorSpan) errorSpan.textContent = errorMessage;
        }

        return isValid;
    };

    // ولیدیشن در هنگام خروج از فیلد
    Object.values(formInputs).forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateField(input));
            
            // حذف خطا در هنگام تایپ
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorSpan = input.parentElement.querySelector('.form-error');
                    if (errorSpan) errorSpan.textContent = '';
                }
            });
        }
    });

    // ارسال فرم
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ولیدیشن تمام فیلدها
        let isFormValid = true;
        Object.values(formInputs).forEach(input => {
            if (input && !validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // اسکرول به اولین خطا
            const firstError = appointmentForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // جمع‌آوری داده‌ها
        const formData = {
            name: formInputs.name.value.trim(),
            phone: formInputs.phone.value.trim(),
            date: formInputs.date.value,
            time: formInputs.time.value,
            message: appointmentForm.querySelector('[name="message"]')?.value.trim() || ''
        };

        // دکمه ارسال
        const submitBtn = appointmentForm.querySelector('.btn-full');
        const originalBtnText = submitBtn.innerHTML;
        
        try {
            // غیرفعال کردن دکمه و نمایش لودینگ
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

            // شبیه‌سازی ارسال به سرور (2 ثانیه تاخیر)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // در اینجا می‌توانید کد ارسال واقعی به سرور را اضافه کنید
            // مثال:
            // const response = await fetch('/api/appointments', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            console.log('درخواست نوبت:', formData);

            // نمایش پیام موفقیت
            showNotification('درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.', 'success');

            // ریست فرم
            appointmentForm.reset();

        } catch (error) {
            console.error('خطا در ارسال فرم:', error);
            showNotification('متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید یا با ما تماس بگیرید.', 'error');
        } finally {
            // فعال کردن دوباره دکمه
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // حذف نوتیفیکیشن قبلی اگر وجود دارد
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(notification);

    // انیمیشن ورود
    setTimeout(() => notification.classList.add('show'), 10);

    // دکمه بستن
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => closeNotification(notification));

    // بستن خودکار بعد از 5 ثانیه
    setTimeout(() => closeNotification(notification), 5000);
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0) {
    // ایجاد لایت‌باکس
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close"><i class="fas fa-times"></i></button>
        <button class="lightbox-prev"><i class="fas fa-chevron-right"></i></button>
        <button class="lightbox-next"><i class="fas fa-chevron-left"></i></button>
        <div class="lightbox-content">
            <img src="" alt="">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].alt;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].alt;
    }

    // رویدادها
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // بستن با کلیک روی بک‌گراند
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // کیبورد نویگیشن
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showNext();
        if (e.key === 'ArrowRight') showPrev();
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// المنت‌هایی که باید انیمیت شوند
const animatedElements = document.querySelectorAll(`
    .service-card,
    .insurance-card,
    .gallery-item,
    .about-img-wrapper,
    .about-content,
    .appointment-form,
    .appointment-info
`);

animatedElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ===== COUNTER ANIMATION FOR STATS =====
const animateCounter = (element) => {
    // convert Persian digits to English
    const toEn = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    // convert English digits back to Persian
    const toFa = s => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

    const original = element.textContent;
    const hasPlus = original.includes('+');
    const target = parseInt(toEn(original).replace(/[^0-9]/g, ''), 10);

    // skip stats that aren't numbers (e.g. "هزاران")
    if (isNaN(target)) return;

    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = toFa(target) + (hasPlus ? '+' : '');
            clearInterval(counter);
        } else {
            element.textContent = toFa(current) + (hasPlus ? '+' : '');
        }
    }, 16);
};


// فقط یک بار اجرا شود
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach(stat => animateCounter(stat));
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - header.offsetHeight - 10;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'بازگشت به بالا');
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== PHONE NUMBER CLICK TO CALL =====
const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
phoneLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // در موبایل مستقیم تماس می‌گیرد، در دسکتاپ کپی می‌شود
        if (window.innerWidth > 768) {
            e.preventDefault();
            const phoneNumber = link.textContent.trim();
            
            // کپی به کلیپ‌برد
            if (navigator.clipboard) {
                navigator.clipboard.writeText(phoneNumber)
                    .then(() => showNotification('شماره تلفن کپی شد', 'success'))
                    .catch(() => showNotification('برای تماس روی شماره کلیک کنید', 'info'));
            }
        }
    });
});
// booking.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".booking-buttons .btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", handleBookingClick);
  });

  function handleBookingClick(e) {
    const btn = e.currentTarget;
    const platform = btn.dataset.platform || "unknown";

    // Visual feedback
    setLoadingState(btn, true);

    // Optional: log analytics
    logEvent(platform);

    // Restore button state after a short delay
    setTimeout(() => setLoadingState(btn, false), 1500);
  }

  function setLoadingState(btn, isLoading) {
    if (isLoading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = "در حال انتقال...";
      btn.style.opacity = "0.75";
      btn.style.pointerEvents = "none";
    } else {
      btn.textContent = btn.dataset.originalText;
      btn.style.opacity = "";
      btn.style.pointerEvents = "";
    }
  }

  function logEvent(platform) {
    // Replace with your analytics call (e.g. Google Analytics, Plausible, etc.)
    console.log(`[Booking] User clicked: ${platform} — ${new Date().toISOString()}`);

    // Example: Google Analytics 4
    // if (typeof gtag === "function") {
    //   gtag("event", "booking_click", { platform });
    // }
  }
});


// ===== LAZY LOADING IMAGES =====
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== CONSOLE MESSAGE =====
console.log('%c🩺 دکتر آرش فلاحت', 'color: #1a5276; font-size: 20px; font-weight: bold;');
console.log('%cفوق تخصص اینترونشنال کاردیولوژی', 'color: #2980b9; font-size: 14px;');
console.log('%c📞 09334510059', 'color: #27ae60; font-size: 14px;');

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== PREVENT FORM RESUBMISSION =====
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
/* ============================================================
   سیستم نوبت‌دهی آنلاین - مطب قلب و عروق
   booking.js
   ============================================================ */

/* ⚠️ مهم: بعد از ساختن Cloudflare Worker (پیام بعدی)،
   آدرس آن را اینجا قرار دهید: */
const WORKER_URL = "https://clinic-booking.thehunnterrr.workers.dev";
// ================== تنظیمات ==================
; // آدرس Worker خودتان
const OFF_DAYS = [4, 5]; // پنج‌شنبه (4) و جمعه (5)
const HOLIDAYS = []; // تعطیلات رسمی به میلادی، مثال: ['2026-07-10']

// ================== عناصر صفحه ==================
const dateStrip   = document.getElementById('date-strip');
const timeSelect  = document.getElementById('time-select');
const nameInput   = document.getElementById('patient-name');
const phoneInput  = document.getElementById('patient-phone');
const submitBtn   = document.getElementById('submit-btn');
const spinner     = document.getElementById('spinner');
const confirmBox  = document.getElementById('confirmation-box');
const globalError = document.getElementById('global-error');

let selectedDate = null;

// ================== تبدیل ارقام فارسی/عربی به انگلیسی ==================
function toEnglishDigits(str) {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';
  return str.replace(/[۰-۹٠-٩]/g, ch => {
    let i = fa.indexOf(ch);
    if (i === -1) i = ar.indexOf(ch);
    return i.toString();
  });
}

phoneInput.addEventListener('input', () => {
  phoneInput.value = toEnglishDigits(phoneInput.value).replace(/[^\d]/g, '');
});

// ================== ساخت نوار ۷ روزه (تقویم جلالی) ==================
function buildDateStrip() {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const gregorianStr = d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');

    const dayOfWeek = d.getDay(); // 4 = پنج‌شنبه، 5 = جمعه
    const isOff = OFF_DAYS.includes(dayOfWeek) || HOLIDAYS.includes(gregorianStr);

    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'short', day: 'numeric', month: 'long'
    }).formatToParts(d);

    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    const day     = parts.find(p => p.type === 'day')?.value || '';
    const month   = parts.find(p => p.type === 'month')?.value || '';

    const card = document.createElement('div');
    card.className = 'day-card' + (isOff ? ' off-day' : '');
    card.dataset.date = gregorianStr;
    card.innerHTML = `
      <div class="weekday">${weekday}</div>
      <div class="day-num">${day}</div>
      <div class="month-name">${month}</div>
    `;

    if (!isOff) {
      card.addEventListener('click', () => selectDate(card, gregorianStr));
    }

    dateStrip.appendChild(card);
  }
}

// ================== انتخاب تاریخ ==================
function selectDate(card, dateStr) {
  document.querySelectorAll('.day-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedDate = dateStr;

  timeSelect.disabled = false;
  timeSelect.innerHTML = '<option value="">در حال بارگذاری...</option>';
  loadAvailableSlots(dateStr);
}

// ================== ساخت ساعت‌ها (۱۶:۰۰ تا ۲۱:۰۰) ==================
function generateTimeSlots() {
  const slots = [];
  for (let h = 16; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 21) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots; // آخرین نوبت: 21:00
}

// ================== دریافت نوبت‌های رزروشده از Worker ==================
// پیدا کنید و به این شکل اصلاح کنید:
async function loadAvailableSlots(dateStr) {
  try {
    const res = await fetch(`${WORKER_URL}/slots?date=${dateStr}`);
    if (!res.ok) throw new Error('server');
    const data = await res.json();
    
    // اصلاح شد: به جای data.slots از data.booked استفاده می‌کنیم
    const booked = data.booked || []; 

    timeSelect.innerHTML = '<option value="">ساعت را انتخاب کنید</option>';
    generateTimeSlots().forEach(slot => {
      const opt = document.createElement('option');
      opt.value = slot;
      const isBooked = booked.includes(slot);
      opt.textContent = isBooked ? `${slot} — رزرو شده` : slot;
      opt.disabled = isBooked;
      timeSelect.appendChild(opt);
    });
  } catch (e) {
    timeSelect.innerHTML = '<option value="">خطا در بارگذاری ساعت‌ها</option>';
    showError('ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.');
  }
}

// ================== نمایش خطا و تأیید ==================
function showError(msg) {
  globalError.textContent = msg;
  globalError.style.display = 'block';
  confirmBox.style.display = 'none';
}

function hideError() {
  globalError.style.display = 'none';
}

function showConfirmation(name, jalaliDate, time) {
  confirmBox.innerHTML = `
    <strong>✅ نوبت شما با موفقیت ثبت شد!</strong><br>
    ${name} عزیز، نوبت شما برای <strong>${jalaliDate}</strong> ساعت <strong>${time}</strong> رزرو شد.
  `;
  confirmBox.style.display = 'block';
}

// ================== اعتبارسنجی ==================
function validateForm() {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (name.length < 3) {
    showError('لطفاً نام و نام خانوادگی را کامل وارد کنید.');
    return false;
  }
  if (!/^09\d{9}$/.test(phone)) {
    showError('شماره موبایل معتبر نیست. مثال: ۰۹۱۴۱۲۳۴۵۶۷');
    return false;
  }
  if (!selectedDate) {
    showError('لطفاً یک روز را انتخاب کنید.');
    return false;
  }
  if (!timeSelect.value) {
    showError('لطفاً ساعت نوبت را انتخاب کنید.');
    return false;
  }
  return true;
}

// ================== ارسال فرم ==================
// بخش کلیک روی دکمه ثبت نوبت را به این شکل تغییر دهید:
submitBtn.addEventListener('click', async () => {
  hideError();
  if (!validateForm()) return;

  submitBtn.disabled = true;
  if (spinner) spinner.style.display = 'inline-block';

  try {
    const res = await fetch(`${WORKER_URL}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        date: selectedDate,
        time: timeSelect.value
        // نیاز به ارسال dateFa از اینجا نیست، ورکر خودش آن را محاسبه می‌کند
      })
    });

    const data = await res.json();

    // اصلاح شد: به جای data.success از data.ok استفاده می‌کنیم
    if (res.ok && data.ok) { 
      const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date(selectedDate));

      showConfirmation(nameInput.value.trim(), jalaliDate, timeSelect.value);

      // پاک‌سازی فرم
      nameInput.value = '';
      phoneInput.value = '';
      timeSelect.value = '';
      loadAvailableSlots(selectedDate); // به‌روزرسانی ساعت‌ها
    } else if (data.error === 'slot_taken') {
      showError('متأسفانه این نوبت همین الان رزرو شد. لطفاً ساعت دیگری انتخاب کنید.');
      loadAvailableSlots(selectedDate);
    } else {
      showError('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  } catch (e) {
    showError('ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید.');
  } finally {
    submitBtn.disabled = false;
    if (spinner) spinner.style.display = 'none';
  }
});


// ================== شروع ==================
buildDateStrip();
