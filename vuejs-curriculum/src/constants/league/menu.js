const data = [ 
{
  id: "menu",
  icon: "iconsminds-books",
  label: "menu.curriculum",
	clickable: true,
  to: "/league/curriculum/tier/overview",
  subs: [
  {
    icon: "simple-icon-arrow-right",
    label: "menu.overview-3-tier",
    to: "/league/curriculum/tier/overview",
		subs: [
		  {
	      label: "menu.overview",
	      to: "/league/curriculum/tier/overview"
	    },
		  {
	      label: "menu.associate-programmer",
	      to: "/league/curriculum/tier/associate-programmer"
	    },
		  {
	      label: "menu.advanced-programmer",
	      to: "/league/curriculum/tier/advanced-programmer"
	    },
		  {
	      label: "menu.professional-programmer",
	      to: "/league/curriculum/tier/professional-programmer"
	    },			
		],
  },
  ]
},
];
export default data;
