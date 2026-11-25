import{r as c,o as l,g as u,I as s,e as n,c as o,i as p,a as v,b as h,d as f,f as g}from"./scroll-up-BSpX5Smh.js";function d(){const e=document.querySelector("[data-favorites-list]"),t=document.querySelector("[data-favorites-empty]");if(!e||!t)return;const a=u();if(!a.length){e.innerHTML="",t.hidden=!1;return}t.hidden=!0,e.innerHTML=a.map(_).join("")}function m(){const e=document.querySelector("[data-favorites-list]");e&&(e.addEventListener("click",t=>{const a=t.target,r=a.closest("[data-remove-id]");if(r!=null&&r.dataset.removeId){c(r.dataset.removeId),d();return}const i=a.closest("[data-exercise-id]");i!=null&&i.dataset.exerciseId&&l(i.dataset.exerciseId)}),d())}function _(e){return`
    <li class="exercise-card">
      <div class="exercise-card__top">
        <span class="exercise-card__badge">Workout</span>
        <button class="exercise-card__trash" type="button" data-remove-id="${e._id}" aria-label="Remove from favorites">
          <img src="${s.trash}" alt="" width="16" height="16" />
        </button>
        <button class="exercise-card__start" type="button" data-exercise-id="${e._id}">
          Start
          <img src="${s.arrowRight}" alt="" width="16" height="16" />
        </button>
      </div>
      <h3 class="exercise-card__title">
        <img src="${s.runner}" alt="" width="24" height="24" />
        ${n(o(e.name))}
      </h3>
      <ul class="exercise-card__meta">
        <li>Burned calories: <span>${e.burnedCalories} / ${e.time} min</span></li>
        <li>Body part: <span>${n(o(e.bodyPart))}</span></li>
        <li>Target: <span>${n(o(e.target))}</span></li>
      </ul>
    </li>
  `}p();v();h();f({onFavoritesChange:d});g();m();
//# sourceMappingURL=favorites-BPUYnvyY.js.map
