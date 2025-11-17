from manim import *
import numpy as np

class PythagoreanTheorem(Scene):
    def construct(self):
        # Title
        title = Text("Twierdzenie Pitagorasa", font_size=48)
        subtitle = Text("a² + b² = c²", font_size=36, color=YELLOW)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create a right triangle
        # Define vertices
        A = np.array([-2, -1.5, 0])  # Bottom left
        B = np.array([2, -1.5, 0])   # Bottom right  
        C = np.array([-2, 1.5, 0])   # Top left

        # Create the triangle
        triangle = Polygon(A, B, C, color=WHITE, stroke_width=3)
        
        # Create right angle indicator
        right_angle_size = 0.3
        right_angle = Square(side_length=right_angle_size, color=WHITE, stroke_width=2)
        right_angle.move_to(A + right_angle_size/2 * np.array([1, 1, 0]))
        
        # Labels for sides
        a_label = Text("a = 3", font_size=24, color=BLUE)
        a_label.next_to(Line(A, C).get_center(), LEFT)
        
        b_label = Text("b = 4", font_size=24, color=GREEN)
        b_label.next_to(Line(A, B).get_center(), DOWN)
        
        c_label = Text("c = ?", font_size=24, color=RED)
        c_label.next_to(Line(B, C).get_center(), UR)
        
        # Show the triangle with labels
        self.play(Create(triangle), Create(right_angle))
        self.play(Write(a_label), Write(b_label), Write(c_label))
        self.wait(1)

        # Create squares on each side
        # Square on side a
        square_a = Square(side_length=3, color=BLUE, fill_opacity=0.3)
        square_a.rotate(PI/2)
        square_a.move_to(A + np.array([-1.5, 1.5, 0]))
        
        # Square on side b
        square_b = Square(side_length=4, color=GREEN, fill_opacity=0.3)
        square_b.move_to(A + np.array([2, -2, 0]))
        
        # Square on side c (hypotenuse)
        c_length = 5  # We know it's 5 for a 3-4-5 triangle
        square_c = Square(side_length=c_length, color=RED, fill_opacity=0.3)
        # Rotate to align with hypotenuse
        angle = np.arctan2(3, 4)
        square_c.rotate(angle)
        # Position it correctly
        square_c.move_to(Line(B, C).get_center() + c_length/2 * np.array([np.sin(angle), np.cos(angle), 0]))
        
        # Area labels
        area_a = Text("9", font_size=36, color=BLUE)
        area_a.move_to(square_a.get_center())
        
        area_b = Text("16", font_size=36, color=GREEN)
        area_b.move_to(square_b.get_center())
        
        area_c = Text("?", font_size=36, color=RED)
        area_c.move_to(square_c.get_center())
        
        # Animate squares appearing
        self.play(
            Create(square_a), Create(square_b), Create(square_c),
            Write(area_a), Write(area_b), Write(area_c)
        )
        self.wait(1)

        # Show the calculation
        calculation = VGroup(
            Text("a²", font_size=32, color=BLUE),
            Text("+", font_size=32),
            Text("b²", font_size=32, color=GREEN),
            Text("=", font_size=32),
            Text("c²", font_size=32, color=RED)
        ).arrange(RIGHT, buff=0.3)
        calculation.to_edge(UP)
        
        values = VGroup(
            Text("3²", font_size=28, color=BLUE),
            Text("+", font_size=28),
            Text("4²", font_size=28, color=GREEN),
            Text("=", font_size=28),
            Text("c²", font_size=28, color=RED)
        ).arrange(RIGHT, buff=0.3)
        values.next_to(calculation, DOWN, buff=0.3)
        
        numbers = VGroup(
            Text("9", font_size=28, color=BLUE),
            Text("+", font_size=28),
            Text("16", font_size=28, color=GREEN),
            Text("=", font_size=28),
            Text("25", font_size=28, color=RED)
        ).arrange(RIGHT, buff=0.3)
        numbers.next_to(values, DOWN, buff=0.3)
        
        self.play(Write(calculation))
        self.wait(0.5)
        self.play(Write(values))
        self.wait(0.5)
        self.play(Write(numbers))
        self.wait(1)
        
        # Update the unknown values
        new_c_label = Text("c = 5", font_size=24, color=RED)
        new_c_label.next_to(Line(B, C).get_center(), UR)
        
        new_area_c = Text("25", font_size=36, color=RED)
        new_area_c.move_to(square_c.get_center())
        
        self.play(
            Transform(c_label, new_c_label),
            Transform(area_c, new_area_c)
        )
        
        # Highlight the equality
        result = Text("c = √25 = 5", font_size=36, color=YELLOW)
        result.next_to(numbers, DOWN, buff=0.5)
        
        self.play(Write(result))
        
        # Visual proof animation
        self.wait(1)
        
        # Move squares to show addition
        self.play(
            square_a.animate.shift(RIGHT * 2 + UP * 3),
            square_b.animate.shift(RIGHT * 2 + UP * 3),
            area_a.animate.shift(RIGHT * 2 + UP * 3),
            area_b.animate.shift(RIGHT * 2 + UP * 3),
        )
        
        plus_sign = Text("+", font_size=48)
        plus_sign.move_to(square_a.get_right() + RIGHT * 0.5)
        equals_sign = Text("=", font_size=48)
        equals_sign.move_to(square_b.get_right() + RIGHT * 0.5)
        
        self.play(
            square_b.animate.shift(RIGHT * 1.5),
            area_b.animate.shift(RIGHT * 1.5),
            Write(plus_sign),
            Write(equals_sign)
        )
        
        self.play(
            square_c.animate.move_to(equals_sign.get_right() + RIGHT * 3),
            area_c.animate.move_to(equals_sign.get_right() + RIGHT * 3)
        )
        
        # Final message
        final_message = VGroup(
            Text("Dla każdego trójkąta prostokątnego:", font_size=32),
            Text("Suma kwadratów przyprostokątnych", font_size=28, color=YELLOW),
            Text("równa się kwadratowi przeciwprostokątnej", font_size=28, color=YELLOW)
        ).arrange(DOWN, buff=0.2)
        final_message.to_edge(DOWN, buff=0.5)
        
        self.play(Write(final_message))
        self.wait(3)