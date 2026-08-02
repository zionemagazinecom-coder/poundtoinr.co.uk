from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


def fit_font(draw: ImageDraw.ImageDraw, text: str, font_path: str, max_width: int, start: int) -> ImageFont.FreeTypeFont:
    size = start
    while size > 24:
        font = ImageFont.truetype(font_path, size)
        if draw.textbbox((0, 0), text, font=font)[2] <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(font_path, 24)


def main() -> None:
    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    title = sys.argv[3]
    subtitle = sys.argv[4]

    image = Image.open(source).convert("RGB")
    image.thumbnail((1200, 800), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (1200, 800), "#061427")
    x = (1200 - image.width) // 2
    y = (800 - image.height) // 2
    canvas.paste(image, (x, y))

    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle((70, 55, 1130, 245), radius=24, fill=(3, 15, 31, 224), outline=(38, 217, 175, 185), width=2)
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    bold = "C:/Windows/Fonts/arialbd.ttf"
    regular = "C:/Windows/Fonts/arial.ttf"
    title_font = fit_font(draw, title, bold, 960, 68)
    subtitle_font = fit_font(draw, subtitle, regular, 960, 32)
    draw.text((600, 90), title, font=title_font, fill="#ffffff", anchor="ma")
    draw.text((600, 184), subtitle, font=subtitle_font, fill="#33e0b5", anchor="ma")

    output.parent.mkdir(parents=True, exist_ok=True)
    for quality in (82, 78, 74, 70, 66, 62, 58, 54, 50, 46, 42):
        canvas.save(output, "WEBP", quality=quality, method=6)
        if output.stat().st_size <= 200 * 1024:
            break

    if output.stat().st_size > 200 * 1024:
        raise RuntimeError(f"Image is still over 200 KB: {output.stat().st_size}")


if __name__ == "__main__":
    main()
