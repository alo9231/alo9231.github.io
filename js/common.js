
document.addEventListener("DOMContentLoaded", function() { 
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


    
    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        const header = document.getElementById("header");
        const content = document.getElementById("content");
        // 50px 이상 스크롤 했을 때
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            header.classList.add("shrink");
            content.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
            content.classList.remove("shrink");
        }
        }
});