from manim import *

class PythagoreanTheoremExplained(Scene):
    def construct(self):
        # Title
        title = Text("Pythagorean Theorem", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create a right triangle with vertices
        A = np.array([-2, -1, 0])
        B = np.array([2, -1, 0])
        C = np.array([2, 2, 0])
        
        triangle = Polygon(A, B, C, color=WHITE, fill_opacity=0.3, fill_color=BLUE)
        
        # Labels for vertices
        label_A = Text("A", font_size=24).next_to(A, LEFT)
        label_B = Text("B", font_size=24).next_to(B, DOWN)
        label_C = Text("C", font_size=24).next_to(C, UP)
        
        # Show the triangle
        self.play(Create(triangle))
        self.play(Write(label_A), Write(label_B), Write(label_C))
        self.wait(1)
        
        # Add right angle indicator
        right_angle = RightAngle(Line(A, B), Line(B, C), length=0.3)
        self.play(Create(right_angle))
        self.wait(1)
        
        # Label the sides
        side_a = MathTex("a", font_size=36, color=RED).next_to(Line(B, C).get_center(), RIGHT)
        side_b = MathTex("b", font_size=36, color=GREEN).next_to(Line(A, B).get_center(), DOWN)
        side_c = MathTex("c", font_size=36, color=YELLOW).next_to(Line(A, C).get_center(), LEFT)
        
        self.play(Write(side_a), Write(side_b), Write(side_c))
        self.wait(2)
        
        # Move triangle to the left to make room for squares
        triangle_group = VGroup(triangle, label_A, label_B, label_C, right_angle, side_a, side_b, side_c)
        self.play(triangle_group.animate.shift(LEFT * 3))
        self.wait(1)
        
        # Create squares on each side
        # Square on side a (vertical side) - 3 units
        square_a = Square(side_length=3, color=RED, fill_opacity=0.5, fill_color=RED)
        square_a.next_to(RIGHT * 2, DOWN, buff=0)
        
        # Square on side b (horizontal side) - 4 units
        square_b = Square(side_length=4, color=GREEN, fill_opacity=0.5, fill_color=GREEN)
        square_b.next_to(RIGHT * 3.5, DOWN, buff=0)
        
        # Square on side c (hypotenuse) - 5 units
        square_c = Square(side_length=5, color=YELLOW, fill_opacity=0.5, fill_color=YELLOW)
        square_c.next_to(RIGHT * 2, UP, buff=0.5)
        
        # Labels for squares
        label_a2 = MathTex("a^2", font_size=24, color=RED).move_to(square_a.get_center())
        label_b2 = MathTex("b^2", font_size=24, color=GREEN).move_to(square_b.get_center())
        label_c2 = MathTex("c^2", font_size=24, color=YELLOW).move_to(square_c.get_center())
        
        # Show squares one by one
        self.play(Create(square_a), Write(label_a2))
        self.wait(1)
        self.play(Create(square_b), Write(label_b2))
        self.wait(1)
        self.play(Create(square_c), Write(label_c2))
        self.wait(2)
        
        # Show the theorem formula
        formula = MathTex("a^2", "+", "b^2", "=", "c^2", font_size=48, color=WHITE)
        formula[0].set_color(RED)
        formula[2].set_color(GREEN) 
        formula[4].set_color(YELLOW)
        formula.to_edge(DOWN)
        self.play(Write(formula))
        self.wait(2)
        
        # Highlight each part of the formula
        self.play(Indicate(label_a2), Indicate(formula[0]))
        self.wait(0.5)
        self.play(Indicate(label_b2), Indicate(formula[2]))
        self.wait(0.5)
        self.play(Indicate(label_c2), Indicate(formula[4]))
        self.wait(2)
        
        # Add explanation text
        explanation = Text("In a right triangle, the square of the hypotenuse", font_size=20)
        explanation2 = Text("equals the sum of squares of the other two sides", font_size=20)
        explanation.next_to(formula, UP, buff=0.5)
        explanation2.next_to(explanation, DOWN, buff=0.3)
        
        self.play(Write(explanation))
        self.play(Write(explanation2))
        self.wait(3)
        
        # Clear screen for example
        self.play(FadeOut(*self.mobjects))
        
        # Example with numbers
        example_title = Text("Example: 3-4-5 Triangle", font_size=36, color=BLUE)
        example_title.to_edge(UP)
        
        example_formula = MathTex("3^2 + 4^2 = 5^2", font_size=40)
        example_calculation = MathTex("9 + 16 = 25", font_size=40)
        example_result = MathTex("25 = 25 \\,\\checkmark", font_size=40, color=GREEN)
        
        example_formula.move_to(ORIGIN)
        example_calculation.next_to(example_formula, DOWN, buff=0.5)
        example_result.next_to(example_calculation, DOWN, buff=0.5)
        
        # Show example
        self.play(Write(example_title))
        self.wait(1)
        self.play(Write(example_formula))
        self.wait(1)
        self.play(Write(example_calculation))
        self.wait(1)
        self.play(Write(example_result))
        self.wait(3)
        
        self.play(FadeOut(*self.mobjects))