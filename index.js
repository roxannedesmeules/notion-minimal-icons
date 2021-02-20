class Icons {
	constructor() {
		this.perRows = 5;

		this.theme   = 'dark';
		this.lightBg = '#FFFEFC';
		this.darkBg  = '#2F3437';

		this._buildColorList();
		this._buildIconList(this.theme === 'light' ? 'Black' : 'White');

		if (this.theme === 'light') {
			this._setLightTheme();
		} else {
			this._setDarkTheme();
		}

		//	update icon to show correct colour
		this.$colorContainer.find(`.column`).on('click', (ev) => {
			this.$iconsContainer.empty();

			const color = $(ev.target).closest('.column').data('color');

			if (['White', 'Grey-25'].indexOf(color) >= 0) {
				this._setDarkTheme();
			}

			if (['Black', 'Grey-75'].indexOf(color) >= 0) {
				this._setLightTheme();
			}

			this._buildIconList(color);
		});

		this.$iconsContainer.find(`.column`).on(`click`, (ev) => {
			const $col = $(ev.target).closest('.column');
			const $img = $col.find(`img`);

			var textArea = document.createElement("textarea");

			//
			// *** This styling is an extra step which is likely not required. ***
			//
			// Why is it here? To ensure:
			// 1. the element is able to have focus and selection.
			// 2. if the element was to flash render it has minimal visual impact.
			// 3. less flakyness with selection and copying which **might** occur if
			//    the textarea element is not visible.
			//
			// The likelihood is the element won't even render, not even a
			// flash, so some of these are just precautions. However in
			// Internet Explorer the element is visible whilst the popup
			// box asking the user for permission for the web page to
			// copy to the clipboard.
			//

			// Place in the top-left corner of screen regardless of scroll position.
			textArea.style.position = 'fixed';
			textArea.style.top = 0;
			textArea.style.left = 0;

			// Ensure it has a small width and height. Setting to 1px / 1em
			// doesn't work as this gives a negative w/h on some browsers.
			textArea.style.width = '2em';
			textArea.style.height = '2em';

			// We don't need padding, reducing the size if it does flash render.
			textArea.style.padding = 0;

			// Clean up any borders.
			textArea.style.border = 'none';
			textArea.style.outline = 'none';
			textArea.style.boxShadow = 'none';
			textArea.style.overflow = 'hidden';
			textArea.style.resize = 'none';
			textArea.style.zIndex = '-1';

			// Avoid flash of the white box if rendered for any reason.
			textArea.style.background = 'transparent';


			textArea.value = $img.attr('src');

			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			document.execCommand('copy');
		});
	}

	get $colorContainer() {
		return $(`#color--container`);
	}

	get $iconsContainer() {
		return $(`#icons--container`);
	}

	get colors() {
		return [
			'Black',
			'Grey-75',
			'Grey-50',
			'Grey-25',
			'White',

			'Blue',
			'Green',
			'Purple',
			'Red',
			'Yellow',
		];
	}

	get icons() {
		return [
			'Arrow-E',
			'Arrow-N',
			'Arrow-NE',
			'Arrow-NW',
			'Arrow-S',
			'Arrow-SE',
			'Arrow-SW',
			'Arrow-W',

			'Book',
			'Document',
			'Documents',

			'Element-Drop',
			'Element-Flame',
			'Element-Leaf',
			'Element-Moon',
			'Element-Snowflake',
			'Element-Stars',
			'Element-Sun',
			'Element-Tree-1',
			'Element-Tree-2',
			'Element-Tree-3',

			'House',
			'Lightbulb',
			'Link',
			'Pencil',

			'Shape-Circle',
			'Shape-Circle-Open-1',
			'Shape-Cube',
			'Shape-Cylinder',
			'Shape-Cylinder-2',
			'Shape-Diamond',
			'Shape-Dome',
			'Shape-Hexagon',
			'Shape-Pentagon',
			'Shape-Sphere',
			'Shape-Star',
			'Shape-Star-2',
			'Shape-Triangle',

			'Squiggle-Beveled',
			'Squiggle-Rounded',
			'Squiggle-Square',

			'Symbol-Dollar',
			'WiFi',
		];
	}

	_buildIcon(color, name, forColor) {
		const $img = $(`<img />`).attr({
			alt: name,
			src: `icons/${name}-${color}-280px.png`
		});

		const $label = this._buildIconLabel(forColor ? color : name);
		const $btn   = this._buildButton(forColor ? 'Show' : 'Copy');

		const $div = $(`<div />`)
						.attr({ class : 'column is-2 has-text-centered block', 'data-color' : color, })
						.append($(`<div />`).attr({ class : 'image is-64x64 mb-2', style : `margin: auto;` }).html($img))
						.append($label)
						.append($btn);

		return $div;
	}

	_buildIconLabel(text) {
		text = text.replaceAll('-', ' ');
		text = text.replaceAll('Element', '');
		text = text.replaceAll('Shape', '');

		if (text.indexOf('Grey') === 0) {
			text = text + '%';
		} else if (text.indexOf('Arrow') === 0) {
			switch (text.split(' ')[1]) {
				case 'E':
					text = text.replace('E', 'East');
					break;
				case 'N':
					text = text.replace('N', 'North');
					break;
				case 'NE':
					text = text.replace('NE', 'North East');
					break;
				case 'NW':
					text = text.replace('NW', 'North West');
					break;
				case 'S':
					text = text.replace('S', 'South');
					break;
				case 'W':
					text = text.replace('W', 'West');
					break;
				case 'SE':
					text = text.replace('SE', 'South East');
					break;
				case 'SW':
					text = text.replace('SW', 'South West');
					break;
			}
		}

		return $(`<p />`).attr({ class: 'mb-2' }).text(text);
	}

	_buildButton(text) {
		return $(`<button />`).attr({
			class: 'button is-small is-primary ' + (this.theme === 'light' ? 'is-inverted' : 'is-outlined'),
			style: `height: 2em; padding-left: 0.7em; padding-right: 0.7em;`
		}).text(text);
	}

	_buildColorList() {
		const $icons  = [];

		this.colors.forEach((color) => {
			$icons.push(this._buildIcon(color, 'Shape-Circle', true)[0].outerHTML);
		});

		this._buildRows($icons, this.$colorContainer);
	}

	_buildIconList(color) {
		const $icons  = [];

		this.icons.forEach((name) => {
			$icons.push(this._buildIcon(color, name, false)[0].outerHTML);
		});

		this._buildRows($icons, this.$iconsContainer);
	}

	_buildRows(icons, $container) {
		do {
			const $list = icons.splice(0, this.perRows);

			$container.append($(`<div />`).attr({ class : 'columns', style : `justify-content: center;` }).append($list.join(' ')));
		} while (icons.length !== 0);
	}

	_setDarkTheme() {
		this.theme = 'dark';

		$(`body`).stop()
			.animate({backgroundColor: this.darkBg}, 300)
			.addClass('has-text-white');

		$(`h1,h2,p`).addClass('has-text-white');

		$(`button`)
			.removeClass('is-inverted')
			.addClass('is-outlined');
	}

	_setLightTheme() {
		this.theme = 'light';

		$(`body`).stop()
			.animate({backgroundColor: this.lightBg}, 300)
			.removeClass('has-text-white');

		$(`h1,h2,p`).removeClass('has-text-white');

		$(`button`)
			.addClass('is-inverted')
			.removeClass('is-outlined');
	}
}

$(document).ready(() => {
	new Icons();
});
