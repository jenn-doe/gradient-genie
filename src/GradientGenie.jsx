import React from "react";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const GenieContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 25px;
	border-radius: 250px;
	height: 500px;
	width: 500px;
`;

const Input = styled.input`
	display: flex;
	margin: 12px;
`;

const ResultContainer = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 250px;
	height: 500px;
	width: 500px;
`;

const Text = styled.span`
	margin: 12px;
	line-spacing: 1px;
	font-size: 24px;
	font-family: courier;
`;

const ResultText = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 250px;
	height: 500px;
	width: 500px;
	line-spacing: 1px;
	font-size: 16px;
`;

Container.displayName = "Container";
GenieContainer.displayName = "GenieContainer";
Input.displayName = "Input";
ResultContainer.displayName = "Result";
ResultText.displayName = "ResultText";

class GradientGenie extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputMediaURL: ""
		};
	}
	// Consumes a URL (for now just an image), calculates its average RGB, hex, and HSL value,
	// and displays a pretty gradient genie graphic. TODO: use proxy to get around cross-origin
	// errors, video support, error handling, style input box, decide on react event handling for inputs, allow user interactivity
	getAverageColourFromURL(url) {
		// construct a new image element
		let img = new Image();
		img.src = url;
		img.onload = function() {
			// use HTML5 canvas to draw the media
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const width = (canvas.width = img.naturalWidth);
			const height = (canvas.height = img.naturalHeight);

			ctx.drawImage(img, 0, 0);

			let imageData = ctx.getImageData(0, 0, width, height);
			let data = imageData.data;
			let r = 0;
			let g = 0;
			let b = 0;

			// Calculate the RGB values for the media, stepping by 4 pixels at a time
			for (let i = 0, l = data.length; i < l; i += 4) {
				r += data[i];
				g += data[i + 1];
				b += data[i + 2];
			}

			r = Math.floor(r / (data.length / 4));
			g = Math.floor(g / (data.length / 4));
			b = Math.floor(b / (data.length / 4));

			const rgb = { r: r, g: g, b: b };

			// Convert RGB values to usable string
			const rgbString = `rgb(${rgb.r}, ${rgb.b},${rgb.g})`;

			// Convert RGB values to usable hex string
			const hexString = (
				"#" +
				("0" + rgb.r.toString(16)).slice(-2) +
				("0" + rgb.g.toString(16)).slice(-2) +
				("0" + rgb.b.toString(16)).slice(-2)
			).toUpperCase();

			// Convert RGB values to usable HSL string
			r /= 255;
			g /= 255;
			b /= 255;
			let max = Math.max(r, g, b),
				min = Math.min(r, g, b);
			let h,
				s,
				l = (max + min) / 2;

			if (max === min) {
				h = s = 0; // achromatic
			} else {
				let d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
					default:
						break;
				}
				h /= 6;
			}
			const hslString = `hsl(${h}, ${s}, ${l})`;

			// Create a gradient to display from the HSL values
			const gradient = `linear-gradient(${hexString}, #fff)`;

			// Find the elements in the DOM and apply styles TODO: pass down via props,
			// add in options for user input (type of colour value, gradient options, HSL/HSLa options)
			const resultArea = document.querySelector(".resultContainer");
			const resultAreaText = document.querySelector(".resultTextValue");
			resultArea.style.background = gradient;
			resultAreaText.innerHTML = `in HEX: ${hexString}, in RGB: ${rgbString}, gradient:${gradient}`;
		};
	}

	handleChange = e => {
		this.setState({
			inputMediaURL: e.target.value
		});
	};

	render() {
		return (
			<Container>
				<GenieContainer>
					<Input type="text" name="mediaURL" onBlur={this.handleChange} />
					<ResultContainer
						backgroundColour={this.getAverageColourFromURL(
							this.state.inputMediaURL
						)}
						className="resultContainer"
					>
						<ResultText>
							<Text>The average colour of the media at this URL is: </Text>
							<Text className="resultTextValue"></Text>
						</ResultText>
					</ResultContainer>
				</GenieContainer>
			</Container>
		);
	}
}

export default GradientGenie;
