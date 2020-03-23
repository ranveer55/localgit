$(document).ready(function(){

	/* ------------------------------------------------
	Owl START
	------------------------------------------------ */

			if($('.course_carousel').length){

				$('.course_carousel').owlCarousel({
				    loop: false,
				    nav: false,
				    dots: true,
				    responsive:{
				        0:{
				            items: 1,
				            margin: 0,
				        },
				        992:{
				        	items: 3,
				        },
				        1300:{
				        	items: 4,
				            margin: 12,
				        }
				    },
				    onInitialize: owlChart
				})
			
			}

			function owlChart(){
				var ctx4 = document.getElementById('myChart4').getContext('2d');
				var myChar = new Chart(ctx4, {
				    type: 'line',
				    
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0,
				            data: [20, 10, 25, 10, 15, 13],
				            backgroundColor: [
				                'rgb(0, 115, 222, 0.5)'
				            ],
				            borderColor: [
				                '#0073DE'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});

				var ctx5 = document.getElementById('myChart5').getContext('2d');
				var myChar2 = new Chart(ctx5, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(74, 217, 145, 0.5)'
				            ],
				            borderColor: [
				                '#4AD991'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});

				var ctx6 = document.getElementById('myChart6').getContext('2d');
				var myChar3 = new Chart(ctx6, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(255, 115, 129, 0.5)'
				            ],
				            borderColor: [
				                '#FF7381'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});

				var ctx7 = document.getElementById('myChart7').getContext('2d');
				var myChar2 = new Chart(ctx7, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(74, 217, 145, 0.5)'
				            ],
				            borderColor: [
				                '#4AD991'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});

				var ctx8 = document.getElementById('myChart8').getContext('2d');
				var myChar3 = new Chart(ctx8, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(255, 115, 129, 0.5)'
				            ],
				            borderColor: [
				                '#FF7381'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}


	/* ------------------------------------------------
	Owl END
	------------------------------------------------ */

	/* ------------------------------------------------
	FORMSTYLER START
	------------------------------------------------ */

			if ($('.styler').length){
				$('.styler').styler({
					selectSmartPositioning: true
				});
			}

	/* ------------------------------------------------
	FORMSTYLER END
	------------------------------------------------ */

	/* ------------------------------------------------
	Datepicker START
	------------------------------------------------ */
	
			if($('.datepicker').length){

				// $('.datepicker').datepicker({
				// 	showOtherMonths: true,
				// 	selectOtherMonths: true
				// 	// minDate: new Date()
				// });

				$("#startDate").datepicker({
					showOtherMonths: true,
					selectOtherMonths: true,
					onSelect: function (selectedDate) {
						var orginalDate = new Date(selectedDate);
						var monthsAddedDate = new Date(new Date(orginalDate).setMonth(orginalDate.getMonth() + 3));
						console.log(monthsAddedDate);
						$("#endDate").datepicker("option", 'minDate', selectedDate);
						$("#endDate").datepicker("option", 'maxDate', monthsAddedDate);
					}
				});

		        $("#endDate").datepicker({
					showOtherMonths: true,
					selectOtherMonths: true,
					onSelect: function (selectedDate) {
						var orginalDate = new Date(selectedDate);
						var monthsAddedDate = new Date(new Date(orginalDate).setMonth(orginalDate.getMonth() - 3));
						console.log(monthsAddedDate);
						$("#startDate").datepicker("option", 'minDate', monthsAddedDate);
						$("#startDate").datepicker("option", 'maxDate', selectedDate);
					}
		        })

			}

	/* ------------------------------------------------
	Datepicker END
	------------------------------------------------ */

	/* ------------------------------------------------
	Dropzone START
	------------------------------------------------ */

	        if($('.upload_box').length){

        		var myDropzone = new Dropzone("div#upload_box", { url: "file-upload"});
	    		
	        }

	/* ------------------------------------------------
	Dropzone END
	------------------------------------------------ */

	/* ------------------------------------------------
	Chart START
	------------------------------------------------ */
	
			
			if($('#myChart').length){
				var ctx = document.getElementById('myChart').getContext('2d');
				var myChar = new Chart(ctx, {
				    type: 'line',
				    
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 25, 10, 15, 13],
				            backgroundColor: [
				                'rgb(0, 115, 222, 0.5)'
				            ],
				            borderColor: [
				                '#0073DE'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart2').length){
				var ctx2 = document.getElementById('myChart2').getContext('2d');
				var myChar2 = new Chart(ctx2, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(74, 217, 145, 0.5)'
				            ],
				            borderColor: [
				                '#4AD991'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart3').length){
				var ctx3 = document.getElementById('myChart3').getContext('2d');
				var myChar3 = new Chart(ctx3, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(255, 115, 129, 0.5)'
				            ],
				            borderColor: [
				                '#FF7381'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart9').length){
				var ctx9 = document.getElementById('myChart9').getContext('2d');
				var myChar9 = new Chart(ctx9, {
				    type: 'line',
				    
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 25, 10, 15, 13],
				            backgroundColor: [
				                'rgb(0, 115, 222, 0.5)'
				            ],
				            borderColor: [
				                '#0073DE'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart10').length){
				var ctx10 = document.getElementById('myChart10').getContext('2d');
				var myChar10 = new Chart(ctx10, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(74, 217, 145, 0.5)'
				            ],
				            borderColor: [
				                '#4AD991'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart11').length){
				var ctx11 = document.getElementById('myChart11').getContext('2d');
				var myChar11 = new Chart(ctx11, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(255, 115, 129, 0.5)'
				            ],
				            borderColor: [
				                '#FF7381'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart12').length){
				var ctx12 = document.getElementById('myChart12').getContext('2d');
				var myChar12 = new Chart(ctx12, {
				    type: 'line',
				    
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 25, 10, 15, 13],
				            backgroundColor: [
				                'rgb(0, 115, 222, 0.5)'
				            ],
				            borderColor: [
				                '#0073DE'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart13').length){
				var ctx13 = document.getElementById('myChart13').getContext('2d');
				var myChar13 = new Chart(ctx13, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(74, 217, 145, 0.5)'
				            ],
				            borderColor: [
				                '#4AD991'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}

			if($('#myChart14').length){
				var ctx14 = document.getElementById('myChart14').getContext('2d');
				var myChar14 = new Chart(ctx14, {
				    type: 'line',
				    data: {
				        labels: ['', '', '', '', '', ''],
				        datasets: [{
				            label: '',
				            lineTension: 0.2,
				            data: [20, 10, 40, 5, 8, 9],
				            backgroundColor: [
				                'rgb(255, 115, 129, 0.5)'
				            ],
				            borderColor: [
				                '#FF7381'
				            ],
				            borderWidth: 1,
				            pointRadius:0
				        }]
				    },
				    options: {
				    	legend:{
				    		display: false
				    	},
				    	
				        scales: {
				            yAxes: [{
				            	display: false
				            }],
				            xAxes: [{
				            	display: false
				            }]
				        }
				    }
				});
			}


			if($('#myChart15').length){
				window.chartColors = {
					color1: '#FF7381',
					color2: '#06CBFF',
					color3: '#7CC6AF'
				};
				var barChartData = {
					labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7'],
					datasets: [{
						label: 'Curso General De Inglés 104 Portega',
						backgroundColor: window.chartColors.color1,
						borderWidth: 0,
						barThickness: 12,
						pointRadius:3,
						// yAxisID: 'y-axis-1',
						data: [10, 15, 20, 25, 30, 35, 40]
					},
					{
						label: 'Curso General De Inglés 104 Portega',
						backgroundColor: window.chartColors.color2,
						borderWidth: 0,
						barThickness: 12,
						pointRadius:3,
						// yAxisID: 'y-axis-2',
						data: [10, 15, 20, 25, 30, 35, 40]
					},
					{
						label: 'Curso General De Inglés 104 Portega',
						backgroundColor: window.chartColors.color3,
						borderWidth: 0,
						barThickness: 12,
						pointRadius:3,
						// yAxisID: 'y-axis-3',
						data: [10, 15, 20, 25, 30, 35, 40]
					}]

				};
				var ctx15 = document.getElementById('myChart15').getContext('2d');
				window.myBar = new Chart(ctx15, {
					type: 'bar',
					data: barChartData,
					options: {
						responsive: true,
						title: {
							display: false,
							text: 'Chart.js Bar Chart - Multi Axis'
						},
						tooltips: {
							mode: 'index',
							intersect: true
						},
						scales: {
							barThickness: 5,
							yAxes: [{
								type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
								display: true,
								position: 'left',
								ticks:{
									fontSize: 22,
									// lineHeight: 26,
									fontColor: '#43425D',
									fontFamily: 'SFProDisplay',
									beginAtZero: true,
									max:100,
									min: 0,
									stepSize: 25,
									callback: function(value, index, values) {
				                        return value+'%';
				                    }
								},
								gridLines: {
									// drawOnChartArea: false
									drawBorder:false
								}
							}],
							xAxes:[{
					            // barThickness: 12,
					            barPercentage: 0.6,
					            categoryPercentage: 0.4,
								gridLines: {
									drawOnChartArea: false
								},
								ticks:{
									fontSize: 22,
									// lineHeight: 26,
									fontColor: '#43425D',
									fontFamily: 'SFProDisplay',
									beginAtZero: true,
									max:100,
									min: 0,
									stepSize: 25
								},
							}]
						}
					}
				});
			}

	/* ------------------------------------------------
	Chart END
	------------------------------------------------ */

	/* ------------------------------------------------
	Magnific Popup
	------------------------------------------------ */

			if($('.popup-link').length){
				$('.popup-link').magnificPopup({
				  type:'inline',
				  // showCloseBtn:true,
				  // closeBtnInside:true,
				  // closeMarkup: '<button title="%title%" type="button" class="mfp-close"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.642 15.642" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 15.642 15.642"><path fill-rule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061 c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061 l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541 l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z"/></svg></button>',
				  // midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
				  preloader: false,
				  callbacks: {
				      beforeOpen: function() {
				      	// checkform();
				      },
				      open: function() {
				      	// checkform();
				      },
				      close: function() {
				        // Will fire when popup is closed
				      }
				      // e.t.c.
				    }
				});
				function checkform(){
					if(!$('body').find('.form_popup .js-input').val() == ""){
						$('body').find('.form_popup .js-input').addClass('is-focus');
						$('body').find('.form_popup .js-input').closest('.form_row').addClass('is-focus');
					}
				}


				// var magnificPopup = $.magnificPopup.instance; // save instance in magnificPopup variable

				// $('.popup_container').on('click', '.mfp-close', function(){
				// 	$.magnificPopup.close(); // Close popup that is currently opened
				// })
			}

	/* ------------------------------------------------
	Magnific Popup END
	------------------------------------------------ */

	/* ------------------------------------------------
	Sticky START
	------------------------------------------------ */
			
			if($('.js-sticky').length){
				if($(window).width() <= 767){
					$('.js-sticky').sticky({
						topSpacing: $('header').outerHeight(),
						// getWidthFrom: '.sidebar',
						bottomSpacing: $('footer').outerHeight() + 50
					});
				}

			}

			if($('.js-sticky-menu').length){
				if($(window).width() >= 768){
					$('.js-sticky-menu').sticky({
						topSpacing: $('header').outerHeight() + 50,
						// getWidthFrom: '.sidebar',
						bottomSpacing: $('footer').outerHeight() + 50
					});
				}

			}


	/* ------------------------------------------------
	End of Sticky
	------------------------------------------------ */


});

$(window).load(function() {

});