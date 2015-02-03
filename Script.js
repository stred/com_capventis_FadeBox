
function com_capventis_FadeBox_Done() {
    Qv.AddExtension("com_capventis_FadeBox",
        function() {
			
			// Assign the extension object to a local variable
			var _this = this;

			// Get the chart ID from the QlikView document for this control - will be something like "CH2340091" or "CH01"
			var divName = _this.Layout.ObjectId.replace("Document\\", "").replace("Server\\", "");

			// Grab the settings from the extension object 
			var vContainerID = _this.Layout.Text0.text.trim();
			var vHTMLForShow = _this.Layout.Text1.text.trim();
			var vHTMLForHide = _this.Layout.Text2.text.trim();
			var vFadeDirection = _this.Layout.Text3.text.trim();
			var vTransitionSpeed = parseInt(_this.Layout.Text4.text)

			// sense check some of the entries				
			if (vContainerID.trim() == '' || vContainerID == 'NaN')
			{
				alert('the Container ID must be specified');
			}
			else if(vHTMLForShow.trim() == '' || vHTMLForShow == 'NaN' )
			{
				alert('The html for the Show button must be specified');
			}
			else if(vHTMLForHide.trim() == '' || vHTMLForShow == 'NaN' )
			{
				alert('The html for the Hide button must be specified');
			}
			else if(vFadeDirection.trim() == '' || vFadeDirection == 'NaN')
			{
				alert('The fade in option needs to be entered - right,left,up,down');
			}
			else if(vFadeDirection.trim().toUpperCase() != 'RIGHT' && 
				vFadeDirection.trim().toUpperCase() != 'LEFT' &&
				vFadeDirection.trim().toUpperCase() != 'UP' &&
				vFadeDirection.trim().toUpperCase() != 'DOWN')
			{
				alert('The fade in option needs to be entered - right,left,up,down');
			}
			else if(vTransitionSpeed == 'NaN' || vTransitionSpeed < 1 || vTransitionSpeed > 9999)
			{
				alert('The Transition Speed needs to be specified in the range 1-9999');
			}
			else
			{
				// Grab the width and height of the object
				var vw = _this.GetWidth();
				var vh = _this.GetHeight();

				$('.QvFrame').each(function () {
					if(this.className.indexOf(vContainerID)>-1)
					{
						if($("#fadeBoxtd" + divName).length==0)
						{
							var newDiv='<div id="CVL' + this.id + '"';
							newDiv+='"><table border="0" ><tr><td><div id="fadeBoxtd' + divName + '"></div></td></tr></table></div>'
							$("#" + this.parentElement.id).append(newDiv);
						}
						// Make our object a child of the TD
						$("#" + this.id).appendTo($("#fadeBoxtd" + divName));
						$("#fadeBoxtd" + divName).css("visibility", "collapse");
						$("#fadeBoxtd" + divName).hide();
						
						window['fadeBox'+divName]=$("#" + this.id);
						window['fadeBox'+divName].hide();
						window['fadeBoxStatus'+divName]='Hidden';
					}
				});

				// If we have found the Container, create the magic button
				if (window['fadeBox'+divName] != null)
				{
					// Set the inner html of the extension object to a div, including the chart id, that we can use in code
					_this.Element.innerHTML = '<table width="100%" height="100%" style="border-style: none; align: center"><tr>'
						  + '<td id="clickboxShowtd'
						  + divName
						  + '" style="visibility: visible;">'
						  +	'<div id="clickboxShow'
						  + divName
						  + '" style="width:' + vw + 'px;'
						  + 'height:' + vh + 'px;'
						  + 'left: 0; position: absolute; text-align: center; vertical-align: middle;'
						  + 'top: 0;z-index:999; ">' 
						  + vHTMLForShow + '</div></td>'
						  + '<td id="clickboxHidetd'
						  + divName
						  + '" style="visibility: collapse;">'
						  + '<div id="clickboxHide'
						  + divName
						  + '" style="width:' + vw + 'px;'
						  + 'height:' + vh + 'px;'
						  + 'left: 0; position: absolute; text-align: center; vertical-align: middle;'
						  + 'top: 0;z-index:999; ">' 
						  + vHTMLForHide + '</div></td></tr></table>';

					// Create a click handler function for the div - this is where the magic happens
					$("#clickboxShow"+divName).click(function (e) { 
						// jQuery.UI call to slide the box in.
						$("#fadeBoxtd" + divName).css("visibility", "visible");
						$("#fadeBoxtd" + divName).show();
						window['fadeBox'+divName].hide();
						window['fadeBox'+divName].show("slide", { direction: vFadeDirection }, vTransitionSpeed, function() { } );

						$("#clickboxShowtd"+divName).css("visibility", "collapse");
						$("#clickboxHidetd"+divName).css("visibility", "visible");
						window['fadeBoxStatus'+divName]='Visible';
					});
					
					$("#clickboxHide"+divName).click(function (e) { 
						window['fadeBox'+divName].hide("slide", { direction: vFadeDirection }, vTransitionSpeed, function() { } );
						$("#fadeBoxtd" + divName).css("visibility", "collapse");
						$("#fadeBoxtd" + divName).hide();

						$("#clickboxHidetd"+divName).css("visibility", "collapse");
						$("#clickboxShowtd"+divName).css("visibility", "visible");
						window['fadeBoxStatus'+divName]='Hidden';
					});
				
				}
			}
			
        }, false);
}
function com_capventis_FadeBox_Init() {
    var files = [];
    com_capventis_FadeBox_Done();
}
com_capventis_FadeBox_Init();

