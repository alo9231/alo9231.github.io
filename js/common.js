
document.addEventListener("DOMContentLoaded", function() { 

    let ticking = false; //과부하 방지 최적화용
    
    //헤더 스크롤 했을때 작아지고 커지는 이벤트
    function scrollHeaderEvent() {
        const header = document.getElementById("header");
        const content = document.getElementById("content");
        // 50px 이상 스크롤 했을 때
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 100) {
            header.classList.add("shrink");
            content.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
            content.classList.remove("shrink");
        }
    }

    // 헤더 네비게이션 클릭 시 이동
    document.querySelectorAll('.menuItem .link_menu').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // href="#"의 동작(맨 위로 이동) 방지

            // data-target 속성에서 섹션 ID 가져오기
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
            // 해당 섹션으로 부드럽게 스크롤
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // 섹션의 시작 위치에 맞춤
            });
            }
        });
    });

    // 메인 키비쥬얼 홀로그램 버튼 클릭 시 섹션1로 이동
     document.querySelector('.mousey').addEventListener('click', function(event) {
        // 클릭 시 기본 동작(페이지 상단 이동 등)을 막음
        event.preventDefault(); 
        
        // 대상 요소 찾기
        const targetSection = document.getElementById('section1');
        
        // 부드럽게 스크롤 이동
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start' // 섹션의 시작 위치에 맞춤
        });
    });  

    // 메인 키비쥬얼 홀로그램 버튼 - 오늘날짜출력
    function printToday() {
        // 1. 오늘 날짜 객체 생성
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        // 2. 요일 배열 생성 (0: 일요일 ~ 6: 토요일)
        const week = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = week[now.getDay()];

        // 3. 날짜 포맷 (YYYY년 MM월 DD일 (요일))
        const today = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;

        // 4. span 태그에 삽입
        const dateElement = document.getElementById('date');
        if (dateElement) {
            dateElement.innerHTML = today;
        }
    }
    printToday();

    
    //work 스크롤 페이드인 이벤트 | 섹션 2 
    function workObserverActive(){
        const li = document.querySelectorAll('.list_work li');

          const options = {
            // 뷰포트를 기준으로 설정 (root: null)
            root: null,
            // 화면 하단(100%)에서 50% 올라온 지점을 감지
            rootMargin: "0px 0px -50% 0px",
            // 0px(한 픽셀이라도 보이면) 또는 0.01 이상 설정
            threshold: 0
        };


        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 감지 지점 안으로 들어오면 클래스 추가
                    entry.target.classList.add('active');
                } else {
                    // 감지 지점 밖으로 나가면 클래스 제거
                    // entry.boundingClientRect.top이 0보다 크면 '화면 아래쪽'으로 나간 것입니다.
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.classList.remove('active');
                    }
                }
            });
        }, options);

        li.forEach(section => {
        observer.observe(section);
        });
    }

    workObserverActive();

    // work 스크롤 프로그래스바 이벤트 | 섹션 2

    function section2BgProgress() {
        const section2 = document.getElementById('section2');
        const bgFill = document.querySelector('.bg-fill');
        
        // 아이템 체크 로직이 필요 없으므로 items 변수 삭제
        if (!section2 || !bgFill) return;

        const rect = section2.getBoundingClientRect();
        const sectionHeight = section2.offsetHeight;
        const viewportHeight = window.innerHeight;

        let progress = 0;

        // 1. 배경 진행률 계산 (0 ~ 100)
        // 섹션이 화면 상단에 닿았을 때(rect.top <= 0)부터 계산 시작
        if (rect.top <= 0) {
            const scrolled = Math.abs(rect.top);
            // 전체 스크롤 가능한 범위 (섹션 높이 - 뷰포트 높이)
            const scrollable = sectionHeight - viewportHeight;
            
            progress = (scrolled / scrollable) * 100;
        }

        // 0% ~ 100% 범위 제한
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;

        // 배경 프로그래스바 너비 업데이트
        bgFill.style.width = progress + "%";
    }

    // 스크롤했을때 커지는 호버 영역 | 섹션 3
    function scrollScaleEvent(){
           const box = document.querySelector('.box_scale')

        // 뷰포트 높이
        const viewportHeight = window.innerHeight;
        // 요소의 위치값
        const elementTop = box.getBoundingClientRect().top;
        
        // 조건: 하단에서 3분의 1 지점 (viewportHeight * 2/3)
        // 1. 내려갈 때: 3분의 1 지점보다 위에 요소가 위치하면 (값 < 2/3)
        if (elementTop < viewportHeight * 0.7) {
            box.classList.add('grow'); // 커진 상태
        } 
        // 2. 위로 올라갈 때: 3분의 1 지점보다 아래로 내려가면 (1/3보다 적게 보이면)
        else {
            box.classList.remove('grow'); // 작아짐
        }
    }


    
    //무한 롤링 텍스트 | 섹션 4
    function createLoopingText(el) {
        const lerp = (current, target, factor) => current * (1 - factor) + target * factor;

        const state = {
            el, 
            lerp: {
            current: 0,
            target: 0 
            },
            interpolationFactor: 0.1, // 선형 보간에 사용되는 요인
            speed: 0.2, 
            direction: -1
        };
        
        state.el.style.cssText = 'position: relative; display: inline-flex; white-space: nowrap;';
        state.el.children[1].style.cssText = `position: absolute; left: ${100 * -state.direction}%;`;

    
        function animate() {
            state.lerp.target += state.speed;
            state.lerp.current = lerp(state.lerp.current, state.lerp.target, state.interpolationFactor);

            if (state.lerp.target > 100) {
            state.lerp.current -= state.lerp.target;
            state.lerp.target = 0;
            }

            const x = state.lerp.current * state.direction;
            state.el.style.transform = `translateX(${x}%)`;
        }

        function render() {
            animate();
            window.requestAnimationFrame(render);
        }

        render();
        return state;
    }

    document.querySelectorAll('.loop-container').forEach(el => createLoopingText(el));


    // section4 활성화 상태 저장 변수 (아이폰 최적화 & 실행 오류 수정) ---
    // --- 섹션 4 패럴랙스 (동시 반응 버전) ---
    let isSection4Active = false; 
    const s4 = document.getElementById('section4');
    const parallaxCircles = [
        document.querySelector('.circle-1'),
        document.querySelector('.circle-2'),
        document.querySelector('.circle-3'),
        document.querySelector('.circle-4')
    ];
    const s4_speeds = [0.25, -0.18, 0.1, -0.08];

    function updateParallax() {
        // 'ease'를 거치지 않고 실제 스크롤 위치를 즉시 가져옵니다.
        const immediateScrollY = window.pageYOffset;

        if (isSection4Active && s4) {
            parallaxCircles.forEach((circle, i) => {
                if (circle) {
                    // 관성 없이 즉각적인 스크롤 위치를 사용하되, 속도 격차만 적용
                    const relativeScroll = immediateScrollY - s4.offsetTop;
                    const yPos = relativeScroll * s4_speeds[i];
                    
                    // translate3d로 하드웨어 가속은 유지 (아이폰 버벅임 방지)
                    circle.style.transform = `translate3d(0, ${yPos.toFixed(2)}px, 0)`;
                }
            });
        }
        // 아이폰 Safari의 스크롤 동기화를 위해 rAF는 유지합니다.
        requestAnimationFrame(updateParallax);
    }

    // 루프 시작
    requestAnimationFrame(updateParallax);

    // 섹션 감시 옵저버 (기존과 동일)
    function section4Observer() {
        if (!s4) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSection4Active = entry.isIntersecting;
            });
        }, { threshold: 0 });
        observer.observe(s4);
    }
    section4Observer();

    //스크롤 시 애니메이션 활성화
    function sectionObserverActive() {
    const sections = document.querySelectorAll(".box");
    const navLinks = document.querySelectorAll(".menuItem .link_menu");

    // 1. 섹션 애니메이션용 옵저버 (빨리 반응: 하단 10~20%)
    const sectionOptions = {
        root: null,
        rootMargin: "0px 0px -20% 0px", // 섹션이 조금만 올라와도 바로 active
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                // 아래로 완전히 내려가서 사라질 때만 active 제거
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove("active");
                }
            }
        });
    }, sectionOptions);

    // 2. 메뉴 네비게이션용 옵저버 (느리게 반응: 화면 중앙 -50%)
    const navOptions = {
        root: null,
        rootMargin: "0px 0px -50% 0px", // 화면 절반 이상 올라와야 메뉴 활성
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const sectionId = entry.target.id;
            const navLink = document.querySelector(`a[data-target="${sectionId}"]`);

            if (entry.isIntersecting) {
                // 현재 들어온 섹션의 메뉴만 활성화
                navLinks.forEach(a => a.classList.remove("active"));
                if (navLink) navLink.classList.add("active");
            } else {
                // 섹션이 기준선을 벗어나면 메뉴 active 제거
                if (navLink) navLink.classList.remove("active");
            }
        });
    }, navOptions);

    // 모든 섹션에 대해 두 옵저버를 각각 실행
    sections.forEach((section) => {
        sectionObserver.observe(section);
        navObserver.observe(section);
    });
}

    sectionObserverActive();



    // 위로 가기
    const btnTop = document.querySelector(".btn_top");
    
    function goTopEvent (){
        // 스크롤 위치가 0보다 크면 'active' 클래스 추가아니면 제거
        if (window.scrollY > 0) {
            btnTop.classList.add('active');
        } else {
            btnTop.classList.remove('active');
        }
    }

    // 버튼 클릭 시 최상단으로 이동
    btnTop.addEventListener('click',() => {
        window.scrollTo({
            top: 0, behavior: 'smooth' // 부드럽게 이동
        });
    });


    // 최적화된 스크롤 핸들러
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                scrollHeaderEvent();    
                section2BgProgress();
                scrollScaleEvent();            
                goTopEvent();
                ticking = false;
            });
            ticking = true;
        }
    }

    // 기존 window.onscroll 대신 이벤트 리스너 사용 (성능에 더 좋음)
    window.addEventListener('scroll', handleScroll, { passive: true });

    
});