import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
 	{  
	  path: "/league",
		name: "league",
    redirect: "/league/curriculum",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
		props: true,
    children: [
      {
        path: "curriculum",
				name: "curriculum",
        redirect: "/league/curriculum/tier",
				props: true,
        component: () =>
          import(/* webpackChunkName: "menu" */ "./views/app/league"),
        children: [
          {
            path: "tier",
        		redirect: "/league/curriculum/tier/overview",
            props: true,
            component: () =>
              import(/* webpackChunkName : "menu-curriculum" */ "./views/app/league/curriculum"),
	          children: [
		          {
		            path: "overview",
								name: "overview",
								props: true,
                component: () =>
                  import(
										/* webpackChunkName: "menu-tiers" */ 
										"./views/app/league/curriculum/Overview"
										)
		          },
		          {
                path: "associate-programmer",
								name: "associate-programmer", 
                component: () =>
                  import(
										/* webpackChunkName: "menu-tiers" */ 
										"./views/app/league/curriculum/overview/Associate-Programmer"
										)
              },
              {
                path: "advanced-programmer",
                component: () =>
                  import(
										/* webpackChunkName: "menu-tiers" */ 
										"./views/app/league/curriculum/overview/Advanced-Programmer"
										)

              },
              {
                path: "professional-programmer",
                component: () =>
                  import(
										/* webpackChunkName: "menu-tiers" */ 
										"./views/app/league/curriculum/overview/Professional-Programmer"
										)
		          },
		          {
		            path: "students",            
		            component: () =>
		              import(/* webpackChunkName : "menu-students" */ "./views/app/league/curriculum/students"),
								redirect: "/league/tier/curriculum/students/level-1",
								children: [
		              {
		                path: "level-0",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-0")
		              },
		              {
		                path: "level-1",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-1")
		              },
		              {
		                path: "level-2",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-2")
		              },
		              {
		                path: "level-3",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-3")
		              },
		              {
		                path: "level-4",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-4")
		              },
		              {
		                path: "level-5",
		                component: () =>
		                  import(/* webpackChunkName: "menu-students-levels" */ "./views/app/league/curriculum/students/Level-5")
		              }, 
	              ]           
		          },
		          {
		            path: "teachers",            
		            component: () =>
		              import(/* webpackChunkName : "menu-teachers" */ "./views/app/league/curriculum/teachers"),
								redirect: "/league/tier/curriculum/teachers/level-1",
		            children: [
		              {
		                path: "level-0",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-0")
		              },
		              {
		                path: "level-1",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-1")
		              },
		              {
		                path: "level-2",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-2")
		              },
		              {
		                path: "level-3",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-3")
		              },
		              {
		                path: "level-4",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-4")
		              },
		              {
		                path: "level-5",
		                component: () =>
		                  import(/* webpackChunkName: "menu-teachers-levels" */ "./views/app/league/curriculum/teachers/Level-5")
		              }, 
                ]           
	          },
            ]
          }
        ]
      },
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new Router({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
