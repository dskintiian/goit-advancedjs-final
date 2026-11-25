import{o as h,e as l,c as g,h as _,j as x,F as v,k as S,l as L,I as p,m as w,i as E,a as k,b as q,d as $,f as C}from"./scroll-up-BSpX5Smh.js";function M(e,a,i,c){if(e.innerHTML="",i<=1){e.hidden=!0;return}e.hidden=!1;const d=(r,n,o={})=>{const s=document.createElement("button");return s.type="button",s.className="pagination__btn",s.textContent=r,o.active&&(s.classList.add("is-active"),s.setAttribute("aria-current","page")),o.disabled&&(s.disabled=!0),o.ariaLabel&&s.setAttribute("aria-label",o.ariaLabel),s.addEventListener("click",()=>c(n)),s};H(a,i).forEach(r=>{if(r==="..."){const n=document.createElement("span");n.className="pagination__dots",n.textContent="...",e.append(n);return}e.append(d(String(r),r,{active:r===a}))})}function H(e,a){return a<=5?Array.from({length:a},(i,c)=>c+1):e<=3?[1,2,3,"...",a]:e>=a-2?[1,"...",a-2,a-1,a]:[1,"...",e,"...",a]}const t={filter:"Muscles",category:null,keyword:"",page:1,totalPages:1,mode:"categories"};function P(){const e=document.querySelector("[data-filters]"),a=document.querySelector("[data-search-form]"),i=document.querySelector("[data-search-clear]"),c=document.querySelector("[data-catalog-list]"),d=document.querySelector("[data-pagination]"),f=document.querySelector("[data-breadcrumb]");!e||!c||!d||(e.addEventListener("click",r=>{const n=r.target.closest("[data-filter]");if(!n)return;const o=n.dataset.filter;if(!o||o===t.filter)return;t.filter=o,t.category=null,t.keyword="",t.page=1,t.mode="categories",b(),y(),m();const s=document.querySelector("[data-search-input]");s&&(s.value=""),u()}),c.addEventListener("click",r=>{const n=r.target,o=n.closest("[data-category]");if(o!=null&&o.dataset.category){t.category=o.dataset.category,t.page=1,t.mode="exercises",t.keyword="",y(),m(),u();return}const s=n.closest("[data-exercise-id]");s!=null&&s.dataset.exerciseId&&h(s.dataset.exerciseId)}),a==null||a.addEventListener("submit",r=>{r.preventDefault();const n=a.querySelector("[data-search-input]");t.keyword=(n==null?void 0:n.value.trim())??"",t.page=1,u()}),i==null||i.addEventListener("click",()=>{const r=document.querySelector("[data-search-input]");r&&(r.value=""),t.keyword="",t.page=1,u()}),f&&f.addEventListener("click",r=>{r.target.closest("[data-back-categories]")&&(t.category=null,t.mode="categories",t.keyword="",t.page=1,y(),m(),u())}),b(),y(),m(),u(),window.addEventListener("resize",()=>{}))}async function u(){const e=document.querySelector("[data-catalog-list]"),a=document.querySelector("[data-pagination]"),i=document.querySelector("[data-catalog-empty]");if(!(!e||!a))try{if(e.classList.toggle("catalog__list--categories",t.mode==="categories"),e.classList.toggle("catalog__list--exercises",t.mode==="exercises"),t.mode==="categories"){const c=await _(t.filter,t.page,x());t.totalPages=Number(c.totalPages)||1,e.innerHTML=c.results.map(T).join(""),i&&(i.hidden=c.results.length>0)}else if(t.category){const c=v[t.filter],d=await S({[c]:t.category,keyword:t.keyword||void 0,page:t.page,limit:L()});t.totalPages=Number(d.totalPages)||1,e.innerHTML=d.results.map(I).join(""),i&&(i.hidden=d.results.length>0,i.textContent="No exercises found matching your criteria. Try another search.")}M(a,t.page,t.totalPages,c=>{var d;t.page=c,u(),(d=document.querySelector("[data-exercises-section]"))==null||d.scrollIntoView({behavior:"smooth",block:"start"})})}catch{e.innerHTML="",i&&(i.hidden=!1,i.textContent="Something went wrong. Please try again later."),a.hidden=!0}}function b(){document.querySelectorAll("[data-filter]").forEach(e=>{const a=e.dataset.filter===t.filter;e.classList.toggle("is-active",a),e.setAttribute("aria-pressed",String(a))})}function y(){const e=document.querySelector("[data-search]");e&&(e.hidden=t.mode!=="exercises")}function m(){const e=document.querySelector("[data-breadcrumb]"),a=document.querySelector("[data-exercises-title]");!e||!a||(t.mode==="exercises"&&t.category?(a.textContent="Exercises",e.hidden=!1,e.innerHTML=`/ <button class="breadcrumb__btn" type="button" data-back-categories>${l(g(t.category))}</button>`):(a.textContent="Exercises",e.hidden=!0,e.innerHTML=""))}function T(e){return`
    <li class="category-card">
      <button class="category-card__btn" type="button" data-category="${l(e.name)}">
        <img class="category-card__image" src="${l(e.imgURL)}" alt="" loading="lazy" decoding="async" width="335" height="225" />
        <span class="category-card__overlay">
          <span class="category-card__name">${l(g(e.name))}</span>
          <span class="category-card__filter">${l(e.filter)}</span>
        </span>
      </button>
    </li>
  `}function I(e){return`
    <li class="exercise-card">
      <div class="exercise-card__top">
        <span class="exercise-card__badge">Workout</span>
        <span class="exercise-card__rating">${w(e.rating)}
          <img src="${p.star}" alt="" width="18" height="18" />
        </span>
        <button class="exercise-card__start" type="button" data-exercise-id="${e._id}">
          Start
          <img src="${p.arrowRight}" alt="" width="16" height="16" />
        </button>
      </div>
      <h3 class="exercise-card__title">
        <img src="${p.runner}" alt="" width="24" height="24" />
        ${l(g(e.name))}
      </h3>
      <ul class="exercise-card__meta">
        <li>Burned calories: <span>${e.burnedCalories} / ${e.time} min</span></li>
        <li>Body part: <span>${l(g(e.bodyPart))}</span></li>
        <li>Target: <span>${l(g(e.target))}</span></li>
      </ul>
    </li>
  `}E();k();q();$();C();P();
//# sourceMappingURL=main-DnVwSFHx.js.map
