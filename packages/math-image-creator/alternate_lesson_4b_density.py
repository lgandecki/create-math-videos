from manim import *

class DensityMassVolume(Scene):
    def construct(self):
        # Title
        title = Text("Gęstość = Masa / Objętość", font_size=48)
        subtitle = Text("Większy nie zawsze znaczy cięższy", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Create two identical cubes
        styrofoam_cube = self.create_cube(color=WHITE, opacity=0.8)
        styrofoam_cube.shift(LEFT * 3.5)
        
        steel_cube = self.create_cube(color=GRAY, opacity=0.9)
        steel_cube.shift(RIGHT * 3.5)
        
        # Labels
        styrofoam_label = Text("Styropian", font_size=24).next_to(styrofoam_cube, UP, buff=0.5)
        steel_label = Text("Stal", font_size=24).next_to(steel_cube, UP, buff=0.5)
        
        self.play(
            FadeIn(styrofoam_cube),
            FadeIn(steel_cube),
            Write(styrofoam_label),
            Write(steel_label)
        )
        
        # Show volume - pulsing animation
        volume_text = Text("Objętość: 1000 cm³", font_size=20, color=YELLOW)
        
        # Pulse styrofoam
        volume_text_styro = volume_text.copy().next_to(styrofoam_cube, DOWN, buff=0.5)
        self.play(
            styrofoam_cube.animate.scale(1.1),
            FadeIn(volume_text_styro)
        )
        self.play(styrofoam_cube.animate.scale(1/1.1))
        
        # Pulse steel
        volume_text_steel = volume_text.copy().next_to(steel_cube, DOWN, buff=0.5)
        self.play(
            steel_cube.animate.scale(1.1),
            FadeIn(volume_text_steel)
        )
        self.play(steel_cube.animate.scale(1/1.1))
        
        self.wait()

        # Create balance scale
        scale = self.create_scale()
        scale.shift(DOWN * 1)
        
        self.play(
            Create(scale),
            FadeOut(volume_text_styro, volume_text_steel)
        )
        self.wait()

        # Move cubes to scale
        # Steel cube on left pan
        steel_on_scale = steel_cube.copy()
        self.play(
            steel_on_scale.animate.move_to(scale[1].get_center() + UP * 0.7).scale(0.8),
            run_time=1.5
        )
        
        # Scale tips heavily to the left
        self.play(
            Rotate(scale[3], angle=-PI/6, about_point=scale[3].get_center()),
            scale[1].animate.shift(DOWN * 1.2),
            scale[2].animate.shift(UP * 1.2),
            steel_on_scale.animate.shift(DOWN * 1.2),
            run_time=1
        )
        
        # Add mass label for steel
        steel_mass = Text("Masa = 7.8 kg", font_size=20, color=RED).next_to(steel_on_scale, DOWN, buff=0.3)
        self.play(Write(steel_mass))
        self.wait()

        # Styrofoam cube on right pan
        styrofoam_on_scale = styrofoam_cube.copy()
        self.play(
            styrofoam_on_scale.animate.move_to(scale[2].get_center() + UP * 0.7 + UP * 1.2).scale(0.8),
            run_time=1.5
        )
        
        # Scale barely moves
        self.play(
            Rotate(scale[3], angle=PI/60, about_point=scale[3].get_center()),
            scale[1].animate.shift(UP * 0.1),
            scale[2].animate.shift(DOWN * 0.1),
            steel_on_scale.animate.shift(UP * 0.1),
            styrofoam_on_scale.animate.shift(DOWN * 0.1),
            run_time=0.5
        )
        
        # Add mass label for styrofoam
        styrofoam_mass = Text("Masa = 0.03 kg", font_size=20, color=GREEN).next_to(styrofoam_on_scale, DOWN, buff=0.3)
        self.play(Write(styrofoam_mass))
        self.wait(2)

        # Clear scale animation
        self.play(
            FadeOut(scale, steel_on_scale, styrofoam_on_scale, steel_mass, styrofoam_mass)
        )

        # Show density formula
        formula_title = Text("Formuła gęstości:", font_size=32).to_edge(UP)
        density_formula = MathTex(
            r"\text{Gęstość} = \frac{\text{Masa}}{\text{Objętość}}",
            font_size=48
        ).next_to(formula_title, DOWN, buff=0.5)
        
        self.play(
            Write(formula_title),
            Write(density_formula)
        )
        self.wait()

        # Calculate density for both materials
        # Styrofoam calculation
        styrofoam_calc = MathTex(
            r"\text{Gęstość}_{\text{styropian}} = \frac{0.03 \text{ kg}}{1000 \text{ cm}^3} = \frac{0.03 \text{ kg}}{0.001 \text{ m}^3} = 30 \frac{\text{kg}}{\text{m}^3}",
            font_size=24
        ).shift(LEFT * 2 + DOWN * 0.5)
        
        # Steel calculation
        steel_calc = MathTex(
            r"\text{Gęstość}_{\text{stal}} = \frac{7.8 \text{ kg}}{1000 \text{ cm}^3} = \frac{7.8 \text{ kg}}{0.001 \text{ m}^3} = 7800 \frac{\text{kg}}{\text{m}^3}",
            font_size=24
        ).shift(LEFT * 2 + DOWN * 2)
        
        self.play(Write(styrofoam_calc))
        self.wait()
        self.play(Write(steel_calc))
        self.wait()

        # Visual comparison
        comparison_title = Text("Porównanie wizualne", font_size=28).shift(RIGHT * 3 + UP * 1)
        
        # Bar chart
        bar_base = Line(LEFT * 1, RIGHT * 1).shift(RIGHT * 3 + DOWN * 0.5)
        
        styrofoam_bar = Rectangle(width=0.8, height=0.1, fill_color=WHITE, fill_opacity=0.8)
        styrofoam_bar.align_to(bar_base, DOWN).shift(LEFT * 0.5)
        
        steel_bar = Rectangle(width=0.8, height=3, fill_color=GRAY, fill_opacity=0.9)
        steel_bar.align_to(bar_base, DOWN).shift(RIGHT * 0.5)
        
        styro_bar_label = Text("30", font_size=16).next_to(styrofoam_bar, UP)
        steel_bar_label = Text("7800", font_size=16).next_to(steel_bar, UP)
        
        self.play(
            Write(comparison_title),
            Create(bar_base),
            FadeIn(styrofoam_bar, shift=UP),
            FadeIn(steel_bar, shift=UP),
            Write(styro_bar_label),
            Write(steel_bar_label)
        )
        
        # Ratio text
        ratio = Text("260× gęstsza!", font_size=24, color=YELLOW)
        ratio.next_to(steel_bar, RIGHT)
        arrow = Arrow(styrofoam_bar.get_right(), steel_bar.get_left(), buff=0.1, color=YELLOW)
        
        self.play(
            Create(arrow),
            Write(ratio)
        )
        
        # Final message
        final_message = Text(
            "Ta sama objętość, ale drastycznie różna masa!",
            font_size=28,
            color=GREEN
        ).to_edge(DOWN)
        
        self.play(Write(final_message))
        self.wait(3)

    def create_cube(self, color=WHITE, opacity=0.8):
        # Create a 3D-looking cube using 2D shapes
        # Front face
        front = Square(side_length=2, fill_color=color, fill_opacity=opacity, stroke_width=2)
        
        # Top face (parallelogram)
        top = Polygon(
            front.get_corner(UL),
            front.get_corner(UR),
            front.get_corner(UR) + 0.5 * UR,
            front.get_corner(UL) + 0.5 * UR,
            fill_color=color,
            fill_opacity=opacity * 0.8,
            stroke_width=2
        )
        
        # Right face (parallelogram)
        right = Polygon(
            front.get_corner(UR),
            front.get_corner(DR),
            front.get_corner(DR) + 0.5 * UR,
            front.get_corner(UR) + 0.5 * UR,
            fill_color=color,
            fill_opacity=opacity * 0.6,
            stroke_width=2
        )
        
        return VGroup(front, top, right)

    def create_scale(self):
        # Base
        base = Line(LEFT * 2, RIGHT * 2, stroke_width=3)
        
        # Pans
        left_pan = Line(LEFT * 0.8, RIGHT * 0.8, stroke_width=2).shift(LEFT * 1.5 + UP * 0.5)
        right_pan = Line(LEFT * 0.8, RIGHT * 0.8, stroke_width=2).shift(RIGHT * 1.5 + UP * 0.5)
        
        # Balance beam
        beam = Line(LEFT * 2, RIGHT * 2, stroke_width=3).shift(UP * 0.5)
        
        # Support triangle
        triangle = Triangle().scale(0.3).shift(DOWN * 0.15)
        triangle.set_fill(BLACK, opacity=1)
        
        # Connecting lines
        left_line = Line(beam.get_start(), left_pan.get_center(), stroke_width=1)
        right_line = Line(beam.get_end(), right_pan.get_center(), stroke_width=1)
        
        return VGroup(base, left_pan, right_pan, beam, triangle, left_line, right_line)