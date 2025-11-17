from manim import *

class LogarithmAsDoublings(Scene):
    def construct(self):
        # Title
        title = Text("Logarytm jako \"ile podwojeń?\"", font_size=48)
        subtitle = Text("Logs as \"How many doublings?\"", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create number line
        number_line = NumberLine(
            x_range=[0, 20, 2],
            length=12,
            include_numbers=False,
            include_tip=True
        )
        number_line.shift(DOWN * 1)
        
        # Add specific number labels
        numbers_to_show = [1, 2, 4, 8, 16]
        number_labels = VGroup()
        for num in numbers_to_show:
            label = Text(str(num), font_size=24)
            label.next_to(number_line.n2p(num), DOWN, buff=0.3)
            number_labels.add(label)
        
        self.play(Create(number_line), Write(number_labels))
        
        # Starting point
        start_dot = Dot(number_line.n2p(1), color=YELLOW, radius=0.1)
        self.play(FadeIn(start_dot))
        
        # Function to create jump animation
        def jump_to(from_num, to_num, doubling_count):
            # Create arc
            start_point = number_line.n2p(from_num)
            end_point = number_line.n2p(to_num)
            
            arc = ArcBetweenPoints(
                start_point + UP * 0.1,
                end_point + UP * 0.1,
                angle=PI/3,
                color=GREEN
            )
            
            # Create label
            label_text = f"{doubling_count} podwojenie" if doubling_count == 1 else f"{doubling_count} podwojenia"
            label = Text(label_text, font_size=20, color=GREEN)
            label.move_to(arc.get_center() + UP * 0.5)
            
            # Animate
            self.play(
                Create(arc),
                Write(label),
                start_dot.animate.move_to(end_point)
            )
            self.wait(0.5)
            
            return arc, label
        
        # Animate jumps
        arc1, label1 = jump_to(1, 2, 1)
        arc2, label2 = jump_to(2, 4, 2)
        arc3, label3 = jump_to(4, 8, 3)
        arc4, label4 = jump_to(8, 16, 4)
        
        self.wait(1)
        
        # Fade out all labels and arcs
        self.play(
            FadeOut(label1), FadeOut(label2), FadeOut(label3), FadeOut(label4),
            FadeOut(arc1), FadeOut(arc2), FadeOut(arc3), FadeOut(arc4)
        )
        
        # Highlight number 8
        eight_highlight = Circle(radius=0.3, color=YELLOW, stroke_width=3)
        eight_highlight.move_to(number_line.n2p(8))
        
        question_mark = Text("?", font_size=72, color=YELLOW)
        question_mark.next_to(number_line.n2p(8), UP, buff=1)
        
        self.play(
            Create(eight_highlight),
            Write(question_mark),
            start_dot.animate.move_to(number_line.n2p(8))
        )
        
        # Show logarithm question
        log_question = Text("log₂(8) = ?", font_size=48)
        log_question.next_to(question_mark, UP, buff=0.5)
        
        self.play(Write(log_question))
        self.wait(1)
        
        # Reveal answer
        answer = Text("3", font_size=72, color=GREEN)
        answer.move_to(question_mark)
        
        self.play(
            Transform(question_mark, answer),
            log_question.animate.become(
                Text("log₂(8) = 3", font_size=48).move_to(log_question)
            )
        )
        
        self.wait(1)
        
        # Show the counting again
        counting_visual = VGroup()
        for i in range(3):
            step = VGroup(
                Text(f"2^{i} = {2**i}", font_size=24),
                Text("→", font_size=20),
                Text(f"2^{i+1} = {2**(i+1)}", font_size=24)
            ).arrange(RIGHT, buff=0.3)
            step.shift(UP * (2 - i * 0.8))
            counting_visual.add(step)
        
        counting_label = Text("Liczymy podwojenia:", font_size=24, color=BLUE)
        counting_label.next_to(counting_visual, UP, buff=0.3)
        
        self.play(
            FadeOut(number_line), FadeOut(number_labels), 
            FadeOut(start_dot), FadeOut(eight_highlight),
            Write(counting_label)
        )
        
        for step in counting_visual:
            self.play(Write(step), run_time=0.8)
        
        # Highlight that we needed 3 steps
        three_steps = Text("3 kroki!", font_size=36, color=GREEN)
        three_steps.next_to(counting_visual, RIGHT, buff=1)
        
        self.play(Write(three_steps))
        self.wait(1)
        
        # Clear and show final definition
        self.play(
            FadeOut(counting_visual), FadeOut(counting_label), 
            FadeOut(three_steps), FadeOut(question_mark),
            FadeOut(log_question)
        )
        
        # Final definition
        definition = VGroup(
            Text("Logarytm to po prostu pytanie:", font_size=32),
            Text("Ile razy muszę pomnożyć podstawę przez siebie,", font_size=28, color=YELLOW),
            Text("żeby dostać tę liczbę?", font_size=28, color=YELLOW)
        ).arrange(DOWN, buff=0.3)
        definition.move_to(ORIGIN)
        
        # Add examples
        examples = VGroup(
            Text("log₂(8) = 3  bo  2 × 2 × 2 = 8", font_size=24),
            Text("log₁₀(1000) = 3  bo  10 × 10 × 10 = 1000", font_size=24),
            Text("log₅(25) = 2  bo  5 × 5 = 25", font_size=24)
        ).arrange(DOWN, buff=0.3)
        examples.next_to(definition, DOWN, buff=1)
        
        self.play(Write(definition))
        self.wait(1)
        self.play(Write(examples))
        
        # Final emphasis
        box = SurroundingRectangle(definition[1:], color=YELLOW, buff=0.2)
        self.play(Create(box))
        
        self.wait(3)