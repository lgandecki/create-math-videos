from manim import *

class MultiplicationNumberLine(Scene):
    def construct(self):
        # Create number line
        number_line = NumberLine(
            x_range=[-10, 15, 1],
            length=12,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        number_line.shift(DOWN * 2)
        
        # Add the number line to the scene
        self.add(number_line)
        
        # First example: 4 × 3 = ?
        equation1 = Text("4 × 3 = ?", font_size=48)
        equation1.to_edge(UP)
        self.play(Write(equation1))
        self.wait(1)
        
        # Explanation text
        explanation1 = Text(
            "Multiplication can be thought of as repeated addition.\n4 times 3 means 4 jumps, each 3 units long, starting from zero.",
            font_size=28
        )
        explanation1.next_to(equation1, DOWN, buff=0.5)
        self.play(Write(explanation1))
        self.wait(2)
        
        # Starting point at 0
        start_dot = Dot(number_line.number_to_point(0), color=RED, radius=0.1)
        self.play(Create(start_dot))
        self.wait(0.5)
        
        # Create jumps for 4 × 3
        current_pos = 0
        arrows = []
        jump_labels = []
        
        for i in range(4):
            next_pos = current_pos + 3
            
            # Create arrow
            arrow = CurvedArrow(
                number_line.number_to_point(current_pos),
                number_line.number_to_point(next_pos),
                color=BLUE,
                stroke_width=4
            )
            arrow.shift(UP * 0.5)
            
            # Create jump label
            jump_label = Text(f"Jump {i+1}", font_size=20, color=BLUE)
            jump_label.next_to(arrow, UP, buff=0.1)
            
            arrows.append(arrow)
            jump_labels.append(jump_label)
            
            # Animate arrow and label
            self.play(Create(arrow), Write(jump_label))
            self.wait(0.8)
            
            current_pos = next_pos
        
        # Final position dot
        final_dot = Dot(number_line.number_to_point(12), color=GREEN, radius=0.1)
        self.play(Create(final_dot))
        
        # Complete equation
        complete_equation1 = Text("4 × 3 = 12", font_size=48)
        complete_equation1.to_edge(UP)
        self.play(Transform(equation1, complete_equation1))
        self.wait(2)
        
        # Clear for second example
        self.play(
            FadeOut(explanation1),
            *[FadeOut(arrow) for arrow in arrows],
            *[FadeOut(label) for label in jump_labels],
            FadeOut(start_dot),
            FadeOut(final_dot)
        )
        
        # Second example: 2 × -4 = ?
        equation2 = Text("2 × (-4) = ?", font_size=48)
        equation2.to_edge(UP)
        self.play(Transform(equation1, equation2))
        self.wait(1)
        
        # Explanation for negative multiplication
        explanation2 = Text(
            "This means 2 jumps, each -4 units long, starting from zero.\nSo, we jump to the left.",
            font_size=28
        )
        explanation2.next_to(equation2, DOWN, buff=0.5)
        self.play(Write(explanation2))
        self.wait(2)
        
        # Starting point at 0 again
        start_dot2 = Dot(number_line.number_to_point(0), color=RED, radius=0.1)
        self.play(Create(start_dot2))
        self.wait(0.5)
        
        # Create jumps for 2 × -4
        current_pos = 0
        arrows2 = []
        jump_labels2 = []
        
        for i in range(2):
            next_pos = current_pos - 4
            
            # Create arrow (going left)
            arrow = CurvedArrow(
                number_line.number_to_point(current_pos),
                number_line.number_to_point(next_pos),
                color=ORANGE,
                stroke_width=4
            )
            arrow.shift(UP * 0.5)
            
            # Create jump label
            jump_label = Text(f"Jump {i+1}", font_size=20, color=ORANGE)
            jump_label.next_to(arrow, UP, buff=0.1)
            
            arrows2.append(arrow)
            jump_labels2.append(jump_label)
            
            # Animate arrow and label
            self.play(Create(arrow), Write(jump_label))
            self.wait(0.8)
            
            current_pos = next_pos
        
        # Final position dot
        final_dot2 = Dot(number_line.number_to_point(-8), color=GREEN, radius=0.1)
        self.play(Create(final_dot2))
        
        # Complete equation
        complete_equation2 = Text("2 × (-4) = -8", font_size=48)
        complete_equation2.to_edge(UP)
        self.play(Transform(equation1, complete_equation2))
        self.wait(3)