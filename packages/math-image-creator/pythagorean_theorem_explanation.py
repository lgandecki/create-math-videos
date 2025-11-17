from manim import *
import numpy as np

class PythagoreanTheoremExplanation(Scene):
    def construct(self):
        # Title
        title = Text("Pythagorean Theorem", font_size=48, color=YELLOW)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))
        self.wait(1)

        # Create a right triangle with specific vertices
        A = np.array([-2, -1, 0])  # Bottom left (right angle)
        B = np.array([2, -1, 0])   # Bottom right
        C = np.array([-2, 2, 0])   # Top left

        triangle = Polygon(A, B, C, color=WHITE, stroke_width=3)
        self.play(Create(triangle))
        self.wait(0.5)

        # Add right angle indicator
        right_angle = Square(side_length=0.3, color=WHITE, stroke_width=2, fill_opacity=0)
        right_angle.move_to(A + 0.15 * RIGHT + 0.15 * UP)
        self.play(Create(right_angle))
        self.wait(0.5)

        # Calculate side lengths for this specific triangle
        side_a = 4  # vertical side (AC)
        side_b = 4  # horizontal side (AB)
        side_c = np.sqrt(side_a**2 + side_b**2)  # hypotenuse (BC)

        # Label the sides
        label_a = MathTex("a", font_size=36, color=BLUE)
        label_a.next_to([A[0] - 0.3, (A[1] + C[1]) / 2, 0], LEFT)
        
        label_b = MathTex("b", font_size=36, color=GREEN)
        label_b.next_to([(A[0] + B[0]) / 2, A[1] - 0.3, 0], DOWN)
        
        label_c = MathTex("c", font_size=36, color=RED)
        label_c.next_to([(B[0] + C[0]) / 2, (B[1] + C[1]) / 2, 0], RIGHT)

        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(1)

        # Create squares on each side
        # Square on side a (vertical)
        square_a = Square(side_length=2, color=BLUE, fill_opacity=0.3)
        square_a.move_to(A + LEFT * 1 + UP * 1)
        
        # Square on side b (horizontal)
        square_b = Square(side_length=2, color=GREEN, fill_opacity=0.3)
        square_b.move_to(A + RIGHT * 1 + DOWN * 1)
        
        # Square on side c (hypotenuse) - needs rotation
        square_c = Square(side_length=2 * np.sqrt(2), color=RED, fill_opacity=0.3)
        # Calculate rotation angle
        angle = np.arctan2(C[1] - B[1], C[0] - B[0])
        square_c.rotate(angle)
        # Position it on the hypotenuse
        hyp_mid = (B + C) / 2
        square_c.move_to(hyp_mid + 0.8 * np.array([np.cos(angle + PI/2), np.sin(angle + PI/2), 0]))

        self.play(Create(square_a), Create(square_b), Create(square_c))
        self.wait(1)

        # Add area labels to squares
        area_a = MathTex("a^2", font_size=24, color=BLUE)
        area_a.move_to(square_a.get_center())
        
        area_b = MathTex("b^2", font_size=24, color=GREEN)
        area_b.move_to(square_b.get_center())
        
        area_c = MathTex("c^2", font_size=24, color=RED)
        area_c.move_to(square_c.get_center())

        self.play(Write(area_a), Write(area_b), Write(area_c))
        self.wait(1)

        # Show the theorem formula
        theorem_text = Text("The Pythagorean Theorem states:", font_size=32)
        theorem_text.to_edge(DOWN, buff=2)
        
        formula = MathTex("a^2", "+", "b^2", "=", "c^2", font_size=48)
        formula.next_to(theorem_text, DOWN, buff=0.5)
        
        # Color the formula parts
        formula[0].set_color(BLUE)   # a^2
        formula[2].set_color(GREEN)  # b^2
        formula[4].set_color(RED)    # c^2

        self.play(Write(theorem_text))
        self.wait(0.5)
        self.play(Write(formula))
        self.wait(1)

        # Highlight each part of the equation with corresponding squares
        self.play(Indicate(square_a), Indicate(formula[0]))
        self.wait(0.5)
        self.play(Indicate(square_b), Indicate(formula[2]))
        self.wait(0.5)
        self.play(Indicate(square_c), Indicate(formula[4]))
        self.wait(1)

        # Fade out previous elements to make room for example
        self.play(FadeOut(theorem_text), FadeOut(formula))
        self.wait(0.5)
        
        # Show numerical example - positioned in center bottom area, well clear of squares
        example_text = Text("Example: If a = 3 and b = 4", font_size=28)
        example_text.move_to([0, -2.5, 0])  # Center horizontally, well below main content
        
        self.play(Write(example_text))
        self.wait(0.5)
        
        # Step 1: Initial calculation
        calculation = MathTex("3^2", "+", "4^2", "=", "c^2", font_size=36)
        calculation.next_to(example_text, DOWN, buff=0.4)
        calculation[0].set_color(BLUE)
        calculation[2].set_color(GREEN)
        calculation[4].set_color(RED)
        
        self.play(Write(calculation))
        self.wait(1)
        
        # Step 2: Evaluate squares
        step2 = MathTex("9", "+", "16", "=", "c^2", font_size=36)
        step2.next_to(calculation, DOWN, buff=0.4)
        step2[0].set_color(BLUE)
        step2[2].set_color(GREEN)
        step2[4].set_color(RED)
        
        self.play(Write(step2))
        self.wait(1)
        
        # Step 3: Add the numbers
        step3 = MathTex("25", "=", "c^2", font_size=36)
        step3.next_to(step2, DOWN, buff=0.4)
        step3[2].set_color(RED)
        
        self.play(Write(step3))
        self.wait(1)
        
        # Step 4: Final answer
        final = MathTex("c", "=", "5", font_size=36)
        final.next_to(step3, DOWN, buff=0.4)
        final[0].set_color(RED)
        final[2].set_color(RED)
        
        self.play(Write(final))
        self.wait(2)

        # Final highlight of the complete theorem
        conclusion = Text("This relationship holds for all right triangles!", font_size=28, color=YELLOW)
        conclusion.next_to(final, DOWN, buff=0.6)
        
        self.play(Write(conclusion))
        self.wait(1)
        self.play(Indicate(triangle), Indicate(square_a), Indicate(square_b), Indicate(square_c))
        self.wait(3)