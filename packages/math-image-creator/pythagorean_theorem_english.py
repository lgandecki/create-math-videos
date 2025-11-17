from manim import *
import numpy as np

class PythagoreanTheoremEnglish(Scene):
    def construct(self):
        # Introduction
        self.introduction()
        self.wait(1)
        self.clear()
        
        # Understanding the relationship
        self.understanding_relationship()
        self.wait(1)
        self.clear()
        
        # Quick application
        self.quick_application()
        self.wait(1)
        self.clear()
        
        # Conclusion
        self.conclusion()
        self.wait(2)
    
    def introduction(self):
        # Create a simple right-angled triangle in the center
        triangle = Polygon(
            [0, 0, 0],
            [3, 0, 0],
            [0, 2, 0],
            color=BLUE,
            fill_opacity=0.3
        )
        
        # Add title
        title = Text("The Pythagorean Theorem", font_size=48, color=WHITE)
        title.to_edge(UP)
        
        # Purpose text
        purpose = Text("A fundamental rule for right-angled triangles", font_size=32, color=YELLOW)
        purpose.next_to(title, DOWN, buff=0.5)
        
        # Animate introduction
        self.play(Create(triangle))
        self.wait(0.5)
        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(purpose))
        self.wait(2)
    
    def understanding_relationship(self):
        # Create triangle
        triangle = Polygon(
            [0, 0, 0],
            [3, 0, 0],
            [0, 2, 0],
            color=BLUE,
            fill_opacity=0.3
        )
        
        # Highlight right angle with small square
        right_angle_square = Square(side_length=0.3, color=RED, stroke_width=3)
        right_angle_square.move_to([0.15, 0.15, 0])
        
        # Create labels for sides
        label_a = MathTex("a", color=WHITE, font_size=36)
        label_a.next_to([0, 1, 0], LEFT, buff=0.2)
        
        label_b = MathTex("b", color=WHITE, font_size=36)
        label_b.next_to([1.5, 0, 0], DOWN, buff=0.2)
        
        label_c = MathTex("c", color=WHITE, font_size=36)
        label_c.next_to([1.5, 1, 0], UP + RIGHT, buff=0.1)
        
        # Create squares on sides
        square_a = Square(side_length=2, color=GREEN, fill_opacity=0.5)
        square_a.next_to([0, 0, 0], LEFT, buff=0)
        
        square_b = Square(side_length=3, color=YELLOW, fill_opacity=0.5)
        square_b.next_to([0, 0, 0], DOWN, buff=0)
        
        # For the hypotenuse square, we need to calculate its size and rotation
        c_length = np.sqrt(4 + 9)  # sqrt(a² + b²) = sqrt(13)
        square_c = Square(side_length=c_length, color=RED, fill_opacity=0.5)
        # Rotate to align with hypotenuse
        angle = np.arctan2(2, 3)  # angle of hypotenuse
        square_c.rotate(angle)
        # Position on hypotenuse
        hypotenuse_center = np.array([1.5, 1, 0])
        normal_vec = np.array([-np.sin(angle), np.cos(angle), 0])
        square_c.move_to(hypotenuse_center + (c_length/2) * normal_vec)
        
        # Labels for squares
        label_a_squared = MathTex("a^2", color=WHITE, font_size=24)
        label_a_squared.move_to(square_a.get_center())
        
        label_b_squared = MathTex("b^2", color=WHITE, font_size=24)
        label_b_squared.move_to(square_b.get_center())
        
        label_c_squared = MathTex("c^2", color=WHITE, font_size=24)
        label_c_squared.move_to(square_c.get_center())
        
        # Formula
        formula = MathTex("a^2 + b^2 = c^2", color=WHITE, font_size=48)
        formula.to_edge(DOWN)
        
        # Animate the understanding
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(Create(right_angle_square))
        self.wait(0.5)
        
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(1)
        
        self.play(Create(square_a), Write(label_a_squared))
        self.wait(0.5)
        
        self.play(Create(square_b), Write(label_b_squared))
        self.wait(0.5)
        
        # Create the hypotenuse square directly without the visual combination effect
        self.play(Create(square_c), Write(label_c_squared))
        self.wait(1)
        
        self.play(Write(formula))
        self.wait(2)
    
    def quick_application(self):
        # Create new triangle with specific values
        triangle = Polygon(
            [0, 0, 0],
            [4, 0, 0],  # b = 4
            [0, 3, 0],  # a = 3
            color=BLUE,
            fill_opacity=0.3
        )
        triangle.shift(LEFT * 2)
        
        # Labels with values
        label_a = MathTex("a = 3", color=WHITE, font_size=36)
        label_a.next_to([-2, 1.5, 0], LEFT, buff=0.2)
        
        label_b = MathTex("b = 4", color=WHITE, font_size=36)
        label_b.next_to([0, 0, 0], DOWN, buff=0.2)
        
        label_c = MathTex("c = ?", color=RED, font_size=36)
        label_c.next_to([0, 1.5, 0], UP + RIGHT, buff=0.1)
        
        # Prompt
        prompt = Text("Let's find the missing side 'c'", font_size=32, color=YELLOW)
        prompt.to_edge(UP)
        
        # Calculation steps
        step1 = MathTex("3^2 + 4^2 = c^2", color=WHITE, font_size=36)
        step1.move_to([3, 2, 0])
        
        step2 = MathTex("9 + 16 = c^2", color=WHITE, font_size=36)
        step2.move_to([3, 1, 0])
        
        step3 = MathTex("25 = c^2", color=WHITE, font_size=36)
        step3.move_to([3, 0, 0])
        
        step4 = MathTex("c = \\sqrt{25}", color=WHITE, font_size=36)
        step4.move_to([3, -1, 0])
        
        step5 = MathTex("c = 5", color=GREEN, font_size=36)
        step5.move_to([3, -2, 0])
        
        # Final label
        label_c_final = MathTex("c = 5", color=GREEN, font_size=36)
        label_c_final.next_to([0, 1.5, 0], UP + RIGHT, buff=0.1)
        
        # Animate application
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(0.5)
        
        self.play(Write(prompt))
        self.wait(1)
        
        self.play(Write(step1))
        self.wait(1)
        
        self.play(Write(step2))
        self.wait(1)
        
        self.play(Write(step3))
        self.wait(1)
        
        self.play(Write(step4))
        self.wait(1)
        
        self.play(Write(step5))
        self.wait(1)
        
        self.play(Transform(label_c, label_c_final))
        self.wait(2)
    
    def conclusion(self):
        # Final triangle
        triangle = Polygon(
            [0, 0, 0],
            [3, 0, 0],
            [0, 2, 0],
            color=BLUE,
            fill_opacity=0.3
        )
        
        # Final formula
        formula = MathTex("a^2 + b^2 = c^2", color=WHITE, font_size=48)
        formula.next_to(triangle, UP, buff=1)
        
        # Summary text  
        summary = Text(
            "The sum of the squares of the two shorter sides\nequals the square of the longest side",
            font_size=28,
            color=YELLOW,
        )
        summary.next_to(triangle, DOWN, buff=1)
        
        # Animate conclusion
        self.play(Create(triangle))
        self.wait(0.5)
        
        self.play(Write(formula))
        self.wait(1)
        
        self.play(Write(summary))
        self.wait(3)