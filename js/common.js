document.addEventListener("DOMContentLoaded", function() { 

    let ticking = false; // 과부하 방지 최적화용
    let isScrolling = false; // 클릭 이동 중 옵저버 간섭 방지 플래그



    // [공통 함수] 메뉴 활성화 상태 업데이트
    function setActiveMenu(targetId) {
        const navLinks = document.querySelectorAll('.menuItem .link_menu');
        navLinks.forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute('data-target') === targetId) {
                a.classList.add("active");
            }
        });
    }

    // 1. 헤더 스크롤 이벤트 (Shrink 효과)
    function scrollHeaderEvent() {
        const header = document.getElementById("header");
        const content = document.getElementById("content");
        if (window.scrollY > 50) {
            header.classList.add("shrink");
            content.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
            content.classList.remove("shrink");
        }
    }

    // 2. 네비게이션 클릭 시 정밀 이동 (헤더 높이 제외)
    document.querySelectorAll('.menuItem .link_menu').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const header = document.getElementById("header");

            if (targetElement) {
                isScrolling = true; // 스크롤 중 옵저버 정지
                setActiveMenu(targetId); // 클릭 즉시 메뉴 활성화
                this.blur(); // 포커스 해제로 hover 잔상 제거

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });

                // 이동 완료 후 옵저버 재가동 (애니메이션 시간 고려)
                setTimeout(() => { isScrolling = false; }, 800);
            }
        });
    });

    
    /*** 메인 키비주얼(KV) 섹션의 스크롤 인터랙션을 초기화하는 함수 ***/
    function initMainVisualAnimation() {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".interaction-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                pin: ".sticky-wrapper",
                pinSpacing: true,
                // 브라우저 크기 변경 시 애니메이션 값들을 다시 계산함 (반응형 필수)
                invalidateOnRefresh: true,
                anticipatePin: 1,
                fastScrollEnd: true, // 빠른 스크롤 대응
                preventOverlaps: true // 애니메이션 겹침 방지
            }
        });

        // 애니메이션 내부의 값들도 가급적 픽셀보다는 %나 vw를 사용하는게 좋습니다.
        tl.to("#beltMove", { attr: { startOffset: "5%" }, ease: "none" }, 0)
        .to("#textFor", { x: "-22vw", y: "0", ease: "power2.inOut" }, 0)
        .to("#textBetter", { x: "22vw", y: "0", ease: "power2.inOut" }, 0)
        .to("#zoomBox", {
            width: "100vw",
            height: "100dvh", // 전체화면 확장 시에도 dvh 사용
            borderRadius: "0px",
            ease: "power2.inOut"
        }, 0.1)
        .to("#textFor, #textBetter", { color: "#fff", duration: 0.3 }, 0.7);
    }

    initMainVisualAnimation();

    // 3. 마우스(mousey) 버튼 클릭 시 이동
    const mousey = document.querySelector('.mousey');
    if (mousey) {
        mousey.addEventListener('click', function(e) {
            e.preventDefault();
           const targetSection = document.querySelector('#section4'); // 가고 싶은 다음 섹션 ID
  
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth', // 부드러운 스크롤
                    block: 'start'      // 섹션의 시작 부분에 맞춤
                });
            }
        });
    }

    // 4. 섹션 애니메이션 & 메뉴 활성화 옵저버
    function sectionObserverActive() {
        const sections = document.querySelectorAll(".box");

        // (1) 섹션 등장 애니메이션용
        const animOptions = { rootMargin: "0px 0px -20% 0px" };
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                } else if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove("active");
                }
            });
        }, animOptions);

        // (2) 메뉴 네비게이션 하이라이트용
        const navOptions = {
            rootMargin: "-20% 0px -70% 0px" // 상단 영역 진입 시 즉시 감지
        };
        const navObserver = new IntersectionObserver((entries) => {
            if (isScrolling) return; // 클릭 이동 중에는 무시
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMenu(entry.target.id);
                }
            });
        }, navOptions);

        sections.forEach(section => {
            animObserver.observe(section);
            navObserver.observe(section);
        });
    }
    sectionObserverActive();

    // 5. 작업 리스트(Work) 페이드인 옵저버
    function workObserverActive() {
        const li = document.querySelectorAll('.list_work li');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                }
            });
        }, { rootMargin: "0px 0px -30% 0px" });
        li.forEach(el => observer.observe(el));
    }
    workObserverActive();

    // 6. 프로그래스바 (scaleX 사용으로 리사이즈 떨림 방지)
    function section2BgProgress() {
        const section2 = document.getElementById('section2');
        const bgFill = document.querySelector('.bg-fill');
        if (!section2 || !bgFill) return;

        const rect = section2.getBoundingClientRect();
        if (rect.top <= 0) {
            const scrollable = section2.offsetHeight - window.innerHeight;
            let progress = (Math.abs(rect.top) / scrollable);
            progress = Math.min(Math.max(progress, 0), 1);
            
            // width 대신 transform을 사용하여 성능 최적화 및 떨림 방지
            bgFill.style.transform = `scaleX(${progress})`;
            bgFill.style.transformOrigin = 'left';
            bgFill.style.width = '100%'; 
        }
    }

    // 7. 박스 스케일 이벤트
    function scrollScaleEvent() {
        const box = document.querySelector('.box_scale');
        if (!box) return;
        const elementTop = box.getBoundingClientRect().top;
        if (elementTop < window.innerHeight * 0.7) {
            box.classList.add('grow');
        } else {
            box.classList.remove('grow');
        }
    }

    // 8. 패럴랙스 원형 애니메이션 (translate3d 사용으로 최적화)
    let isSection4Active = false;
    const s4 = document.getElementById('section4');
    const circles = ['.circle-1', '.circle-2', '.circle-3', '.circle-4'].map(c => document.querySelector(c));
    const s4_speeds = [0.25, -0.2, 0.15, -0.12];

    function updateParallax() {
        if (isSection4Active && s4) {
            const relativeScroll = s4.getBoundingClientRect().top;
            circles.forEach((circle, i) => {
                if (circle) {
                    const yPos = (relativeScroll * s4_speeds[i]).toFixed(1);
                    circle.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        }
        requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);

    const s4Observer = new IntersectionObserver(entries => {
        isSection4Active = entries[0].isIntersecting;
    });
    if (s4) s4Observer.observe(s4);

    // 9. 오늘 날짜 출력
    (function printToday() {
        const now = new Date();
        const week = ['일', '월', '화', '수', '목', '금', '토'];
        const today = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일 (${week[now.getDay()]})`;
        const dateElement = document.getElementById('date');
        if (dateElement) dateElement.innerHTML = today;
    })();

    // 10. 무한 롤링 텍스트
    function createLoopingText(el) {
        const lerp = (c, t, f) => c * (1 - f) + t * f;
        const state = { el, lerp: { current: 0, target: 0 }, interpolationFactor: 0.1, speed: 0.2, direction: -1 };
        state.el.style.cssText = 'position: relative; display: inline-flex; white-space: nowrap;';
        state.el.children[1].style.cssText = `position: absolute; left: ${100 * -state.direction}%;`;
        function render() {
            state.lerp.target += state.speed;
            state.lerp.current = lerp(state.lerp.current, state.lerp.target, state.interpolationFactor);
            if (state.lerp.target > 100) { state.lerp.current -= state.lerp.target; state.lerp.target = 0; }
            state.el.style.transform = `translateX(${state.lerp.current * state.direction}%)`;
            requestAnimationFrame(render);
        }
        render();
    }
    document.querySelectorAll('.loop-container').forEach(el => createLoopingText(el));

    // 11. 스크롤 통합 핸들러
    const btnTop = document.querySelector(".btn_top");
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                scrollHeaderEvent();
                section2BgProgress();
                scrollScaleEvent();
                if (btnTop) btnTop.classList.toggle('active', window.scrollY > 100);
                ticking = false;
            });
            ticking = true;
        }
    }

    if (btnTop) btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', handleScroll, { passive: true });
});