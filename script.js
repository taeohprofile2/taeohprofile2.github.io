// DOM 요소 선택
const loader = document.getElementById('loader');
const audioToggle = document.getElementById('audioToggle');
const bgMusic = document.getElementById('bgMusic');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-menu a');
const scrollIndicator = document.querySelector('.scroll-indicator');
const sections = document.querySelectorAll('.section');
const typingText = document.querySelector('.typing-text');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

// 로딩 화면
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        animateOnScroll();
    }, 1500);
});

// 타이핑 효과
const typingMessages = [
    "전과자라는 낙인 속에서도",
    "오직 너만을 향한 절박한 사랑",
    "내 지옥 속 유일한 빛, 너"
];

let messageIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentMessage = typingMessages[messageIndex];
    
    if (!isDeleting) {
        typingText.textContent = currentMessage.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentMessage.length) {
            isDeleting = true;
            typingSpeed = 2000; // 메시지 완성 후 대기
        } else {
            typingSpeed = 100;
        }
    } else {
        typingText.textContent = currentMessage.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % typingMessages.length;
            typingSpeed = 500; // 다음 메시지 시작 전 대기
        } else {
            typingSpeed = 50;
        }
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// 타이핑 효과 시작
setTimeout(typeEffect, 2000);

// 오디오 컨트롤
let isPlaying = false;
audioToggle.addEventListener('click', () => {
    const playIcon = audioToggle.querySelector('.play');
    const pauseIcon = audioToggle.querySelector('.pause');
    
    if (isPlaying) {
        bgMusic.pause();
        playIcon.classList.add('active');
        pauseIcon.classList.remove('active');
    } else {
        bgMusic.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
        playIcon.classList.remove('active');
        pauseIcon.classList.add('active');
    }
    isPlaying = !isPlaying;
});

// 초기 아이콘 설정
audioToggle.querySelector('.play').classList.add('active');

// 네비게이션 토글
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// 네비게이션 링크 클릭
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            const offsetTop = targetSection.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 스크롤 인디케이터
scrollIndicator.addEventListener('click', () => {
    const profileSection = document.getElementById('profile');
    const offsetTop = profileSection.offsetTop - 60;
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

// 스크롤 이벤트
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 네비게이션 바 스타일
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 액티브 섹션 하이라이트
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            const sectionId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    lastScroll = currentScroll;
});

// 스크롤 애니메이션
function animateOnScroll() {
    const animatedElements = document.querySelectorAll(
        '.section-title, .appearance-card, .personality-item, ' +
        '.relationship-card, .dialogue-card, .gallery-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 패럴랙스 효과
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.5}px)`;
    }
});

// 갤러리 라이트박스
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.dataset.image;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// 라이트박스 닫기
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// ESC 키로 라이트박스 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// 마우스 이펙트 (데스크톱용)
if (window.innerWidth > 768) {
    const heroSection = document.querySelector('.hero');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    });
    
    function animateHero() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        
        requestAnimationFrame(animateHero);
    }
    
    animateHero();
}

// 이미지 로드 최적화
const images = document.querySelectorAll('img');
const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 300px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, imageOptions);

images.forEach(img => {
    imageObserver.observe(img);
});

// 부드러운 스크롤 (Safari 대응)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 모바일 터치 이벤트 최적화
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (touchEndY < touchStartY - 50) {
        // 위로 스와이프
        if (navbar.classList.contains('scrolled')) {
            navbar.style.transform = 'translateY(-100%)';
        }
    }
    if (touchEndY > touchStartY + 50) {
        // 아래로 스와이프
        navbar.style.transform = 'translateY(0)';
    }
}

// 성능 최적화를 위한 디바운스
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 리사이즈 이벤트 최적화
const handleResize = debounce(() => {
    // 모바일 메뉴 초기화
    if (window.innerWidth > 768) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250);

window.addEventListener('resize', handleResize);

// 프로필 이미지 호버 효과
const profileImage = document.querySelector('.profile-image img');
if (profileImage) {
    profileImage.addEventListener('mousemove', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        e.target.style.transformOrigin = `${x}% ${y}%`;
    });
}

// 카드 3D 효과
const cards = document.querySelectorAll('.appearance-card, .relationship-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// 페이지 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 모든 애니메이션 트리거
    animateOnScroll();
    
    // 초기 네비게이션 상태 설정
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                const offsetTop = targetElement.offsetTop - 60;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// 에러 처리
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// 이미지 로드 에러 처리
images.forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.error('Image failed to load:', this.src);
    });
});

console.log('윤태오 - 나의 지옥에도 너는 피어나는가'); 