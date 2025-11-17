from manim import *

class DensityMassVolume(Scene):
    def construct(self):
        # Title
        title = Text("Gęstość = masa / objętość", font_size=48)
        subtitle = Text("Density = mass / volume", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create balance scale
        # Base
        base = Rectangle(width=0.5, height=0.3, color=GRAY, fill_opacity=0.8)
        base.to_edge(DOWN, buff=1)
        
        # Pivot
        pivot = Triangle(color=GRAY, fill_opacity=0.8).scale(0.3)
        pivot.next_to(base, UP, buff=0)
        
        # Beam
        beam_length = 8
        beam = Rectangle(width=beam_length, height=0.2, color=GREY_E, fill_opacity=0.8)
        beam.move_to(pivot.get_top())
        
        # Pans
        left_pan = Rectangle(width=2, height=0.1, color=GREY_E, fill_opacity=0.8)
        right_pan = Rectangle(width=2, height=0.1, color=GREY_E, fill_opacity=0.8)
        
        left_chain = Line(beam.get_left() + UP * 0.1, beam.get_left() + DOWN * 1, color=GRAY, stroke_width=2)
        right_chain = Line(beam.get_right() + UP * 0.1, beam.get_right() + DOWN * 1, color=GRAY, stroke_width=2)
        
        left_pan.move_to(left_chain.get_end() + DOWN * 0.05)
        right_pan.move_to(right_chain.get_end() + DOWN * 0.05)
        
        scale = VGroup(base, pivot, beam, left_chain, right_chain, left_pan, right_pan)
        
        # Show scale
        self.play(Create(scale))
        self.wait(0.5)

        # Create large styrofoam cube
        styrofoam_size = 2
        styrofoam = Cube(side_length=styrofoam_size, fill_color=WHITE, fill_opacity=0.9, stroke_color=GRAY)
        styrofoam.move_to(UP * 4)
        
        styrofoam_label = Text("Styropian", font_size=24, color=GRAY)
        styrofoam_label.next_to(styrofoam, RIGHT, buff=0.5)
        
        # Drop styrofoam
        self.play(
            FadeIn(styrofoam),
            Write(styrofoam_label)
        )
        self.wait(0.5)
        
        # Animate styrofoam falling onto left pan
        self.play(
            styrofoam.animate.move_to(left_pan.get_top() + UP * styrofoam_size/2),
            styrofoam_label.animate.next_to(left_pan, LEFT, buff=0.5),
            run_time=1.5
        )
        
        # Scale barely moves
        slight_tilt = 0.05  # radians
        self.play(
            Rotate(beam, angle=slight_tilt, about_point=pivot.get_top()),
            left_pan.animate.shift(DOWN * 0.1 + RIGHT * 0.05),
            right_pan.animate.shift(UP * 0.1 + LEFT * 0.05),
            left_chain.animate.become(
                Line(beam.get_left() + UP * 0.1 + DOWN * 0.1 + RIGHT * 0.05, 
                     left_pan.get_top(), color=GRAY, stroke_width=2)
            ),
            right_chain.animate.become(
                Line(beam.get_right() + UP * 0.1 + UP * 0.1 + LEFT * 0.05, 
                     right_pan.get_top(), color=GRAY, stroke_width=2)
            ),
            styrofoam.animate.shift(DOWN * 0.1 + RIGHT * 0.05),
            run_time=0.5
        )
        
        # Wait and then remove styrofoam
        self.wait(1)
        self.play(
            FadeOut(styrofoam),
            FadeOut(styrofoam_label),
            # Reset scale
            Rotate(beam, angle=-slight_tilt, about_point=pivot.get_top()),
            left_pan.animate.shift(UP * 0.1 + LEFT * 0.05),
            right_pan.animate.shift(DOWN * 0.1 + RIGHT * 0.05),
            left_chain.animate.become(
                Line(beam.get_left() + UP * 0.1, left_pan.get_top() + UP * 0.1 + LEFT * 0.05, 
                     color=GRAY, stroke_width=2)
            ),
            right_chain.animate.become(
                Line(beam.get_right() + UP * 0.1, right_pan.get_top() + DOWN * 0.1 + RIGHT * 0.05, 
                     color=GRAY, stroke_width=2)
            ),
        )
        
        # Create small steel cube
        steel_size = 0.5
        steel = Cube(side_length=steel_size, fill_color=GREY_E, fill_opacity=0.9, stroke_color=BLACK)
        steel.move_to(UP * 4)
        
        steel_label = Text("Stal", font_size=24, color=GREY_E)
        steel_label.next_to(steel, LEFT, buff=0.5)
        
        # Drop steel
        self.play(
            FadeIn(steel),
            Write(steel_label)
        )
        self.wait(0.5)
        
        # Animate steel falling onto right pan
        self.play(
            steel.animate.move_to(right_pan.get_top() + UP * steel_size/2),
            steel_label.animate.next_to(right_pan, RIGHT, buff=0.5),
            run_time=1.5
        )
        
        # Scale tips dramatically
        large_tilt = -0.4  # radians (negative for right side down)
        self.play(
            Rotate(beam, angle=large_tilt, about_point=pivot.get_top()),
            left_pan.animate.shift(UP * 2 + LEFT * 0.8),
            right_pan.animate.shift(DOWN * 2 + RIGHT * 0.8),
            left_chain.animate.become(
                Line(beam.get_left() + UP * 0.1 + UP * 1.5 + LEFT * 0.6, 
                     left_pan.get_top() + UP * 2 + LEFT * 0.8, color=GRAY, stroke_width=2)
            ),
            right_chain.animate.become(
                Line(beam.get_right() + UP * 0.1 + DOWN * 1.5 + RIGHT * 0.6, 
                     right_pan.get_top() + DOWN * 2 + RIGHT * 0.8, color=GRAY, stroke_width=2)
            ),
            steel.animate.shift(DOWN * 2 + RIGHT * 0.8),
            steel_label.animate.shift(DOWN * 2 + RIGHT * 0.8),
            run_time=1,
            rate_func=rush_into
        )
        
        self.wait(1)
        
        # Show the density formula
        formula = Text("Gęstość = Masa / Objętość", font_size=48)
        formula.to_edge(UP, buff=1)
        
        self.play(Write(formula))
        
        # Add comparison data
        styrofoam_data = VGroup(
            Text("Styropian:", font_size=24),
            Text("Duża objętość", font_size=20, color=BLUE),
            Text("Mała masa", font_size=20, color=GREEN),
            Text("Niska gęstość", font_size=20, color=YELLOW)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        styrofoam_data.to_edge(LEFT, buff=1).shift(DOWN * 0.5)
        
        steel_data = VGroup(
            Text("Stal:", font_size=24),
            Text("Mała objętość", font_size=20, color=BLUE),
            Text("Duża masa", font_size=20, color=GREEN),
            Text("Wysoka gęstość", font_size=20, color=YELLOW)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        steel_data.to_edge(RIGHT, buff=1).shift(DOWN * 0.5)
        
        self.play(
            Write(styrofoam_data),
            Write(steel_data)
        )
        
        # Final message
        final_message = Text("Większy nie zawsze znaczy cięższy", font_size=36, color=YELLOW)
        final_message.to_edge(DOWN, buff=0.5)
        
        # Create visual comparison
        size_comparison = VGroup(
            Cube(side_length=1, fill_color=WHITE, fill_opacity=0.7),
            Text(">", font_size=48),
            Cube(side_length=0.5, fill_color=GREY_E, fill_opacity=0.7)
        ).arrange(RIGHT, buff=0.5)
        size_comparison.next_to(final_message, UP, buff=0.5)
        
        weight_comparison = VGroup(
            Cube(side_length=1, fill_color=WHITE, fill_opacity=0.7),
            Text("<", font_size=48, color=RED),
            Cube(side_length=0.5, fill_color=GREY_E, fill_opacity=0.7)
        ).arrange(RIGHT, buff=0.5)
        weight_comparison.move_to(size_comparison)
        
        self.play(FadeIn(size_comparison))
        self.wait(1)
        self.play(Transform(size_comparison, weight_comparison))
        self.play(Write(final_message))
        
        self.wait(3)