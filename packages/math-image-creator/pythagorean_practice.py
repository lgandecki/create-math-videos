from manim import *

class PythagoreanPractice(Scene):
    def construct(self):
        # Title
        title = Text("Putting it into Practice", font_size=36, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create a right-angled triangle
        # Define the vertices for a 3-4-5 triangle
        A = np.array([-2, -1, 0])  # Bottom left (right angle)
        B = np.array([1, -1, 0])   # Bottom right (3 units)
        C = np.array([-2, 2, 0])   # Top left (4 units)
        
        # Create the triangle
        triangle = Polygon(A, B, C, color=WHITE, fill_opacity=0.2, fill_color=BLUE)
        
        # Create the right angle marker
        right_angle_size = 0.3
        right_angle = RightAngle(
            Line(A, B), Line(A, C), 
            length=right_angle_size, 
            quadrant=(-1, 1),
            color=RED
        )
        
        # Present the triangle
        self.play(Create(triangle), Create(right_angle))
        self.wait(1)
        
        # Label the sides
        # Side a (vertical): 3 units
        side_a_label = MathTex("a = 3", color=GREEN).next_to(Line(A, C).get_center(), LEFT)
        
        # Side b (horizontal): 4 units  
        side_b_label = MathTex("b = 4", color=GREEN).next_to(Line(A, B).get_center(), DOWN)
        
        # Side c (hypotenuse): unknown
        side_c_label = MathTex("c = ?", color=YELLOW).next_to(Line(B, C).get_center(), RIGHT)
        
        # Show the labels
        self.play(Write(side_a_label), Write(side_b_label), Write(side_c_label))
        self.wait(2)
        
        # Show the Pythagorean theorem formula
        formula = MathTex("a^2 + b^2 = c^2", color=WHITE, font_size=48)
        formula.move_to(np.array([2, 1, 0]))
        
        self.play(Write(formula))
        self.wait(2)
        
        # Substitute the known values
        substitution = MathTex("3^2 + 4^2 = c^2", color=BLUE, font_size=48)
        substitution.move_to(formula.get_center() + DOWN * 0.8)
        
        self.play(Write(substitution))
        self.wait(2)
        
        # Calculate the squares
        squares = MathTex("9 + 16 = c^2", color=GREEN, font_size=48)
        squares.move_to(substitution.get_center() + DOWN * 0.8)
        
        self.play(Write(squares))
        self.wait(2)
        
        # Sum the values
        sum_result = MathTex("25 = c^2", color=ORANGE, font_size=48)
        sum_result.move_to(squares.get_center() + DOWN * 0.8)
        
        self.play(Write(sum_result))
        self.wait(2)
        
        # Take square root of both sides
        sqrt_step = MathTex("c = \\sqrt{25}", color=RED, font_size=48)
        sqrt_step.move_to(sum_result.get_center() + DOWN * 0.8)
        
        self.play(Write(sqrt_step))
        self.wait(2)
        
        # Display the final result
        final_result = MathTex("c = 5 \\text{ units}", color=YELLOW, font_size=52)
        final_result.move_to(sqrt_step.get_center() + DOWN * 0.8)
        
        self.play(Write(final_result))
        self.wait(1)
        
        # Update the triangle label
        new_side_c_label = MathTex("c = 5", color=YELLOW).next_to(Line(B, C).get_center(), RIGHT)
        self.play(Transform(side_c_label, new_side_c_label))
        
        # Final emphasis
        self.play(
            Indicate(triangle, color=YELLOW),
            Indicate(final_result, color=YELLOW)
        )
        
        self.wait(3)